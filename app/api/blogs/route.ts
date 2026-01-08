import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const adminView = searchParams.get('admin') === 'true'
        const user = await getCurrentUser()

        // Only allow admin view if authenticated
        if (adminView) {
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        let where: any = adminView ? {} : { published: true }

        // If it's an author in admin view, filter by their own blogs
        if (adminView && user?.role === 'AUTHOR') {
            where.authorId = user.id
        }

        const blogs = await prisma.blog.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(blogs)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                description: body.description,
                content: body.content,
                coverImage: body.coverImage,
                category: body.category || "Web Dev",
                authorName: body.authorName || user.email.split('@')[0], // Use email prefix if name not provided
                authorImage: body.authorImage,
                published: body.published || false,
                authorId: user.id
            } as any
        })


        return NextResponse.json(blog)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

