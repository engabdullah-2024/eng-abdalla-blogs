import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function BlogListPage() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container mx-auto px-4 py-12 space-y-8">
            <div className="space-y-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm hover:scale-105 transition-transform">
                        #WebDev
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-medium text-sm hover:scale-105 transition-transform">
                        #AI
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium text-sm hover:scale-105 transition-transform">
                        #FullStack
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 font-medium text-sm hover:scale-105 transition-transform">
                        #Tech
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    All Articles
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore insights on web development, AI, full-stack engineering, and cutting-edge tech.
                </p>
                <div className="pt-4 flex items-center justify-center">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">
                        Showing {blogs.length} of {blogs.length} articles
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog: { id: string; title: string; description: string; coverImage: string | null; createdAt: Date; authorName: string }) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            {blogs.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No articles found.</p>
                </div>
            )}
        </div>
    );
}
