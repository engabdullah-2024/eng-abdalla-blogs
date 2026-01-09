import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: blogId } = await params;

        const comments = await prisma.comment.findMany({
            where: {
                blogId,
                parentId: null // Only top-level comments
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        clerkId: true
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                clerkId: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Fetch comments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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

        const { content, parentId } = await req.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: user.id,
                blogId,
                parentId: parentId || null
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Post comment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
