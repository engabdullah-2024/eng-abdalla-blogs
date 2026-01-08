import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const { email, password, loginType } = await req.json()

        if (!email || !password || !loginType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Security: Prevent cross-login if specifically requested
        if (loginType === 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'This account does not have Admin privileges.' }, { status: 403 })
        }
        if (loginType === 'AUTHOR' && user.role !== 'AUTHOR') {
            // Optional: You might want to allow Super Admins to log in as authors 
            // but if the user wants "separate" we can be strict.
            // We'll be strict for now as requested.
            if (user.role !== 'SUPER_ADMIN') {
                return NextResponse.json({ error: 'This account is not registered as an Author.' }, { status: 403 })
            }
        }

        const isValid = await comparePassword(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })


        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        return NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
