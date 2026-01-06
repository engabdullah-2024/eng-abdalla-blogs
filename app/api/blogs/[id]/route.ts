import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const blog = await prisma.blog.findUnique({ where: { id } })

        if (!blog) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        // specific check for unpublished blogs
        if (!blog.published) {
            const isAuth = await isAuthenticated()
            if (!isAuth) {
                return NextResponse.json({ error: 'Not found' }, { status: 404 })
            }
        }

        return NextResponse.json(blog)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAuth = await isAuthenticated()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, createdAt, updatedAt, ...updateData } = body

        const blog = await prisma.blog.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(blog)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAuth = await isAuthenticated()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await prisma.blog.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
