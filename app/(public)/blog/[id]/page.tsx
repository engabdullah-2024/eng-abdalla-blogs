import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Force dynamic rendering to handle params and auth checks if needed later
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) return { title: "Not Found" };
        return {
            title: blog.title,
            description: blog.description,
        };
    } catch (error) {
        return { title: "Error" };
    }
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let blog;

    try {
        blog = await prisma.blog.findUnique({ where: { id } });
    } catch (e) {
        notFound(); // handle invalid ID format
    }

    if (!blog || !blog.published) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{blog.authorName}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    {blog.title}
                </h1>
            </div>

            {blog.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {blog.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
