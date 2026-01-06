import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const adminView = searchParams.get('admin') === 'true'

        // Only allow admin view if authenticated
        if (adminView) {
            const isAuth = await isAuthenticated()
            if (!isAuth) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        const where = adminView ? {} : { published: true }

        const blogs = await prisma.blog.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(blogs)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const isAuth = await isAuthenticated()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

        // Basic validation
        if (!body.title || !body.firstContentCheck) {
            // We can just rely on frontend for required fields or add more checks
        }

        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                description: body.description,
                content: body.content,
                coverImage: body.coverImage,
                authorName: body.authorName || 'Eng Abdalla', // Default per requirements
                authorImage: body.authorImage,
                published: body.published || false,
            }
        })

        return NextResponse.json(blog)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
