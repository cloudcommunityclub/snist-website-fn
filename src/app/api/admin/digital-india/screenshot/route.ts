/**
 * Admin screenshot proxy route.
 *
 * Acts as a relay to the BN backend's screenshot serving endpoint.
 * The BN handles authentication (API key) and file serving from local disk.
 * This keeps the actual file paths hidden from the client.
 */

import { NextResponse } from 'next/server'

const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const thumb = searchParams.get('thumb') === 'true'

        if (!id) {
            return new Response('Missing submission ID', { status: 400 })
        }

        // Relay to BN with admin API key
        const bnUrl = new URL(
            `${BACKEND_API_URL}/api/admin/digital-india/screenshot`
        )
        bnUrl.searchParams.set('id', id)
        if (thumb) {
            bnUrl.searchParams.set('thumb', 'true')
        }

        const response = await fetch(bnUrl.toString(), {
            headers: {
                'x-api-key': process.env.API_KEY || '',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return new Response('Screenshot not found', { status: 404 })
            }
            return new Response('Failed to retrieve image', {
                status: response.status,
            })
        }

        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/png'

        return new Response(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // 24 hours
            },
        })
    } catch (error) {
        console.error('Screenshot proxy error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
