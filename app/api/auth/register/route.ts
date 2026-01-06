import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        // Security: Only allow registration if NO users exist
        const userCount = await prisma.user.count()

        if (userCount > 0) {
            return NextResponse.json({ error: 'Setup already completed. Please login.' }, { status: 403 })
        }

        const hashedPassword = await hashPassword(password)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || 'Super Admin',
                role: 'SUPER_ADMIN'
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
