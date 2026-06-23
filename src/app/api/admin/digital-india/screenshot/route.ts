import { NextResponse } from 'next/server'
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

        // Fetch image from R2 using backend fetch
        const res = await fetch(record.paymentScreenshotUrl)
        if (!res.ok) {
            return new Response('Failed to retrieve image from storage', { status: res.status })
        }

        const buffer = await res.arrayBuffer()
        const contentType = res.headers.get('content-type') || 'image/png'

        return new Response(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('Screenshot proxy error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
