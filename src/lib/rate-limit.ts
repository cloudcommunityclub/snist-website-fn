const requestCounts = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
    /** Max requests allowed within the window */
    max: number
    /** Window duration in milliseconds (default: 1 minute) */
    windowMs?: number
}

/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Limits requests per IP address within a rolling time window.
 *
 * Note: In serverless environments, this resets per cold-start.
 * For production with multiple instances, use a Redis-based limiter instead.
 */
export function checkRateLimit(
    ip: string,
    { max, windowMs = 60_000 }: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = requestCounts.get(ip)

    if (!entry || now >= entry.resetAt) {
        requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
    }

    entry.count++
    if (entry.count > max) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    return {
        allowed: true,
        remaining: max - entry.count,
        resetAt: entry.resetAt,
    }
}

/** Extract client IP from request headers */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const realIp = request.headers.get('x-real-ip')
    if (realIp) return realIp
    return '127.0.0.1'
}
