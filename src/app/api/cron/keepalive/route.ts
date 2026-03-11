import { NextResponse } from 'next/server'

/**
 * Vercel Cron Job — runs every 10 minutes to keep the Render backend warm.
 * Vercel sends Authorization: Bearer {CRON_SECRET} header automatically.
 * Configure CRON_SECRET in Vercel environment variables.
 */
export async function GET(request: Request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'

    try {
        const start = Date.now()
        const res = await fetch(`${backendUrl}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(15000), // 15s timeout
        })
        const elapsed = Date.now() - start

        if (res.ok) {
            const body = await res.json().catch(() => ({}))
            console.log(`[keepalive] Backend healthy in ${elapsed}ms`, body)
            return NextResponse.json({
                success: true,
                message: 'Backend is warm',
                latencyMs: elapsed,
                timestamp: new Date().toISOString(),
                backendStatus: body,
            })
        }

        console.warn(`[keepalive] Backend returned ${res.status} in ${elapsed}ms`)
        return NextResponse.json({
            success: false,
            message: 'Backend health check returned non-OK status',
            status: res.status,
            latencyMs: elapsed,
        }, { status: 502 })
    } catch (error) {
        console.error('[keepalive] Could not reach backend:', error)
        return NextResponse.json({
            success: false,
            message: 'Could not reach backend',
            error: String(error),
            timestamp: new Date().toISOString(),
        }, { status: 503 })
    }
}
