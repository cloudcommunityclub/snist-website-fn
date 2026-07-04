import dbConnect from '@/lib/db'
import DigitalIndiaSubmission from '@/models/DigitalIndiaSubmission'
import DigitalIndiaAccepted from '@/models/DigitalIndiaAccepted'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const isAccepted = searchParams.get('accepted') === 'true'

        if (!id) {
            return new Response('Missing ID', { status: 400 })
        }

        await dbConnect()

        let record
        if (isAccepted) {
            record = await DigitalIndiaAccepted.findById(id)
        } else {
            record = await DigitalIndiaSubmission.findById(id)
        }

        if (!record || !record.paymentScreenshotUrl) {
            return new Response('Screenshot not found', { status: 404 })
        }

        const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const apiKey = process.env.BACKEND_API_KEY || process.env.API_KEY || ''

        let targetUrl = record.paymentScreenshotUrl
        let fetchHeaders: Record<string, string> = {}

        if (record.paymentScreenshotUrl.startsWith('http')) {
            try {
                const parsedUrl = new URL(record.paymentScreenshotUrl)
                const isTrustedHost = parsedUrl.hostname.endsWith('.r2.dev') ||
                                      parsedUrl.hostname.endsWith('.cloudflarestorage.com') ||
                                      parsedUrl.origin === new URL(backendUrl).origin
                if (!isTrustedHost) {
                    return new Response('Untrusted screenshot URL origin', { status: 403 })
                }
            } catch {
                return new Response('Malformed screenshot URL', { status: 400 })
            }
        } else {
            if (!apiKey) {
                return new Response('Backend storage API key unconfigured', { status: 500 })
            }
            targetUrl = `${backendUrl}/api/admin/digital-india/screenshot?id=${encodeURIComponent(id)}`
            fetchHeaders = { 'x-api-key': apiKey }
        }

        const res = await fetch(targetUrl, { headers: fetchHeaders })

        if (!res.ok) {
            return new Response('Failed to retrieve image from storage', { status: res.status })
        }

        const buffer = await res.arrayBuffer()
        const contentType = res.headers.get('content-type') || 'image/webp'

        return new Response(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        })
    } catch (error) {
        console.error('Screenshot proxy error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
