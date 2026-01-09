import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ChevronLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/blog/like-button";
import { CommentSection } from "@/components/blog/comment-section";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) return { title: "Not Found" };
        return {
            title: `${blog.title} | Declassified Engineering`,
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
        notFound();
    }

    if (!blog || !blog.published) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#030303] transition-colors duration-500 pb-20">
            {/* Post Header Section */}
            <header className="relative pt-20 pb-16 px-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        Back to Repository
                    </Link>

                    <div className="space-y-6">
                        {blog.category && (
                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20 rounded-lg">
                                {blog.category}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                            {blog.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {blog.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 dark:border-white/5 mt-8 pt-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-primary/60" />
                            <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <User className="w-3.5 h-3.5 text-primary/60" />
                            <span>{blog.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-primary/60" />
                            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image Section */}
            <main className="container mx-auto px-4 -mt-10 relative z-20">
                <article className="max-w-4xl mx-auto space-y-12">
                    {blog.coverImage && (
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="relative">
                        <div className="flex justify-start mb-8">
                            <LikeButton blogId={blog.id} />
                        </div>

                        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none 
                            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                            prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-900 dark:prose-strong:text-white
                            prose-code:text-primary prose-code:bg-primary/5 dark:prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-slate-900 dark:prose-pre:bg-black prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                            prose-img:rounded-[2rem] prose-img:border prose-img:border-slate-200 dark:prose-img:border-white/10
                            pt-8"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Interaction Section */}
                    <div className="pt-20 border-t border-slate-200 dark:border-white/5">
                        <CommentSection blogId={blog.id} />
                    </div>

                    {/* Post Footer */}
                    <footer className="pt-20 border-t border-slate-200 dark:border-white/5 pb-20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence End</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic">"Architecture is about making the complex feel simple."</p>
                            </div>
                            <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-black uppercase tracking-widest text-xs gap-3 transition-all">
                                <Share2 className="w-4 h-4" /> Share Implementation
                            </Button>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
