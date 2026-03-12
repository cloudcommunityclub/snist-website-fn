import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
        const apiKey = process.env.API_KEY

        if (!apiKey) {
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
        }

        // Forward all query params to backend
        const backendRes = await fetch(
            `${backendUrl}/api/admin/members?${searchParams.toString()}`,
            { headers: { 'x-api-key': apiKey } }
        )

        if (!backendRes.ok) {
            return NextResponse.json({ message: 'Backend error' }, { status: backendRes.status })
        }

        // Handle CSV export (Content-Type: text/csv)
        const contentType = backendRes.headers.get('content-type') || ''
        if (contentType.includes('text/csv')) {
            const csvText = await backendRes.text()
            return new Response(csvText, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': backendRes.headers.get('content-disposition') || 'attachment; filename="members.csv"',
                },
            })
        }

        const data = await backendRes.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Admin members proxy error:', error)
        return NextResponse.json({ message: 'Could not reach backend' }, { status: 503 })
    }
}
