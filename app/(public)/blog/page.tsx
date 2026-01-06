import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function BlogListPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;

    const blogs = await prisma.blog.findMany({
        where: {
            published: true,
            ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
        },
        orderBy: { createdAt: "desc" },
    });

    const categories = [
        { label: "Web Dev", color: "blue" },
        { label: "AI", color: "green" },
        { label: "FullStack", color: "orange" },
        { label: "Tech", color: "pink" },
        { label: "Cloud", color: "cyan" },
    ];

    return (
        <div className="container mx-auto px-4 py-12 space-y-8">
            <div className="space-y-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                    <Link
                        href="/blog"
                        className={`inline-flex items-center px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105 ${!category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        #All
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.label}
                            href={`/blog?category=${cat.label}`}
                            className={`inline-flex items-center px-4 py-2 rounded-full border font-medium text-sm transition-all hover:scale-105 ${category?.toLowerCase() === cat.label.toLowerCase()
                                ? `bg-${cat.color}-500/20 border-${cat.color}-500/50 text-${cat.color}-600 dark:text-${cat.color}-400`
                                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            #{cat.label}
                        </Link>
                    ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {category ? `${category} Articles` : "All Articles"}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {category
                        ? `A curated collection of my best thoughts and tutorials on ${category}.`
                        : "Explore insights on web development, AI, full-stack engineering, and cutting-edge tech."}
                </p>
                <div className="pt-4 flex items-center justify-center">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">
                        Showing {blogs.length} articles
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
                    <p className="text-muted-foreground">No articles found in this category.</p>
                </div>
            )}
        </div>
    );
}
