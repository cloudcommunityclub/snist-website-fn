import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
        const apiKey = process.env.API_KEY

        if (!apiKey) {
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
        }

        const res = await fetch(`${backendUrl}/api/admin/stats`, {
            headers: { 'x-api-key': apiKey },
            next: { revalidate: 60 }, // cache for 60s
        })

        if (!res.ok) {
            return NextResponse.json({ message: 'Backend error' }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Admin stats proxy error:', error)
        return NextResponse.json({ message: 'Could not reach backend' }, { status: 503 })
    }
}
