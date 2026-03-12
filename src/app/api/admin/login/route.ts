import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { password } = body

        if (!password || typeof password !== 'string') {
            return NextResponse.json({ success: false, message: 'Password required' }, { status: 400 })
        }

        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) {
            console.error('ADMIN_PASSWORD not configured')
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
        }

        if (password !== adminPassword) {
            // Small artificial delay to slow brute force
            await new Promise(r => setTimeout(r, 300))
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
        }

        const secret = new TextEncoder().encode(
            process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-change-in-prod'
        )

        const token = await new SignJWT({ role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('8h')
            .sign(secret)

        const response = NextResponse.json({ success: true })
        response.cookies.set('c3_admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60, // 8 hours in seconds
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Admin login error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
