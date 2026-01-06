import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super_secret_key_123456789'
)

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Protect /admin routes (except login and register)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/register')) {
        const token = req.cookies.get('token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }

        try {
            await jwtVerify(token, JWT_SECRET)
            return NextResponse.next()
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
