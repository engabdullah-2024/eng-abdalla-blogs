import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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
            const user = await getCurrentUser()
            if (!user) {
                return NextResponse.json({ error: 'Not found' }, { status: 404 })
            }
            // Authors can only see their own unpublished blogs
            if (user.role === 'AUTHOR' && (blog as any).authorId !== user.id) {
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
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const blog = await prisma.blog.findUnique({ where: { id } })

        if (!blog) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        // Check ownership
        if (user.role === 'AUTHOR' && (blog as any).authorId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()
        const { id: _, createdAt, updatedAt, authorId, ...updateData } = body

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(updatedBlog)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const blog = await prisma.blog.findUnique({ where: { id } })

        if (!blog) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        // Check ownership
        if (user.role === 'AUTHOR' && (blog as any).authorId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.blog.delete({ where: { id } })


        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

