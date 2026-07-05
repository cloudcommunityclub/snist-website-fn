interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key)
  })
}

export function checkRateLimit(
  ip: string,
  opts: { maxRequests: number; windowMs: number } = { maxRequests: 10, windowMs: 60_000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup()

  const now = Date.now()
  const key = `${ip}:${opts.windowMs}`
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { allowed: true, remaining: opts.maxRequests - 1, resetAt: now + opts.windowMs }
  }

  entry.count++
  if (entry.count > opts.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: opts.maxRequests - entry.count, resetAt: entry.resetAt }
}
