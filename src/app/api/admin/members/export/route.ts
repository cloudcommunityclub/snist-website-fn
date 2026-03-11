import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
        const apiKey = process.env.API_KEY

        if (!apiKey) {
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
        }

        const backendRes = await fetch(`${backendUrl}/api/admin/members/export`, {
            headers: { 'x-api-key': apiKey },
        })

        if (!backendRes.ok) {
            return NextResponse.json({ message: 'Backend export failed' }, { status: backendRes.status })
        }

        const csvText = await backendRes.text()
        return new Response(csvText, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="c3-members-${Date.now()}.csv"`,
            },
        })
    } catch (error) {
        console.error('Members export proxy error:', error)
        return NextResponse.json({ message: 'Could not reach backend' }, { status: 503 })
    }
}
