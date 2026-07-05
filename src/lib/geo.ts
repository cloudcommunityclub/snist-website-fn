export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  const vercelIp = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-vercel-ip')
  if (vercelIp) return vercelIp
  return 'unknown'
}

export function getCountryFromHeaders(request: Request): string | null {
  return request.headers.get('x-vercel-ip-country') || null
}

interface GeoCheckResult {
  allowed: boolean
  reason?: string
  country?: string
}

export async function checkGeoRestrictions(request: Request): Promise<GeoCheckResult> {
  const clientIP = getClientIP(request)

  // 1. Check Vercel geo header (most reliable on Vercel deployment)
  const country = getCountryFromHeaders(request)
  if (country && country !== 'IN') {
    return { allowed: false, reason: 'Registrations are only open to participants from India.', country }
  }

  // 2. If no Vercel geo header, try ip-api.com for VPN/proxy check + country
  if (clientIP !== 'unknown' && clientIP !== '::1' && clientIP !== '127.0.0.1') {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,countryCode,proxy,hosting,query`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'C3-Platform/1.0' },
      })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        if (data.status === 'success') {
          if (data.countryCode && data.countryCode !== 'IN') {
            return { allowed: false, reason: 'Registrations are only open to participants from India.', country: data.countryCode }
          }
          if (data.proxy || data.hosting) {
            return { allowed: false, reason: 'VPN, proxy, or hosting network detected. Please disable and try again.', country: data.countryCode }
          }
          return { allowed: true, country: data.countryCode }
        }
      }
    } catch {
      // If geo check fails, allow by default (don't block legitimate users)
    }
  }

  return { allowed: true, country: country || undefined }
}
