import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_ADMIN_PATHS = ['/admin/login']
const PUBLIC_API_PATHS = ['/api/admin/login']

function isPublic(pathname: string): boolean {
    return (
        PUBLIC_ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/')) ||
        PUBLIC_API_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
    )
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only guard /admin/** routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    // Allow login page and login API
    if (isPublic(pathname)) {
        return NextResponse.next()
    }

    const token = request.cookies.get('c3_admin_session')?.value

    if (!token) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-change-in-prod'
        )
        await jwtVerify(token, secret, { algorithms: ['HS256'] })
        return NextResponse.next()
    } catch {
        // Token invalid or expired — clear it and redirect to login
        const loginUrl = new URL('/admin/login', request.url)
        const response = NextResponse.redirect(loginUrl)
        response.cookies.delete('c3_admin_session')
        return response
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
