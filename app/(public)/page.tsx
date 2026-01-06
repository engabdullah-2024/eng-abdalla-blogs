import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center py-20 md:py-32 px-4 text-center space-y-8 bg-gradient-to-b from-background to-muted/20">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Exploring Tech, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            Building the Future
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
                        Welcome to Eng Abdalla's personal space. Here I share insights on Full-Stack Development,
                        Modern UI/UX, and Scalable Architecture.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/blog">Read Blogs</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                        <Link href="https://github.com/engabdalla" target="_blank">GitHub</Link>
                    </Button>
                </div>
            </section>

            {/* Featured Section */}
            <section className="container mx-auto px-4 py-20 space-y-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
                    <Button variant="ghost" asChild className="group">
                        <Link href="/blog">
                            View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog: { id: string; title: string; description: string; coverImage: string | null; createdAt: Date; authorName: string }) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border rounded-xl bg-muted/10 border-dashed space-y-2">
                        <p className="text-muted-foreground">No articles published yet. Stay tuned!</p>
                        <p className="text-sm text-muted-foreground/60">Admin: Check your dashboard and publish your draft articles.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
