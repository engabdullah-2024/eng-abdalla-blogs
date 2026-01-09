import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: blogId } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Check if blog exists
        const blog = await prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_blogId: {
                    userId: user.id,
                    blogId: blogId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    blogId: blogId
                }
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error('Like error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: blogId } = await params;
        const user = await getCurrentUser();

        const count = await prisma.like.count({
            where: { blogId }
        });

        let isLiked = false;
        if (user) {
            const like = await prisma.like.findUnique({
                where: {
                    userId_blogId: {
                        userId: user.id,
                        blogId: blogId
                    }
                }
            });
            isLiked = !!like;
        }

        return NextResponse.json({ count, isLiked });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
