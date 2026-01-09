import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Search, Layers, Cpu, Globe, Database, PenTool, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

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
        include: {
            _count: {
                select: {
                    likes: true,
                    comments: true
                }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    const categories = [
        { label: "Web Dev", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "AI", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "FullStack", icon: Layers, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Tech", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Cloud", icon: Search, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { label: "Database", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030303] transition-colors duration-500">
            {/* Header / Search Support Section */}
            <section className="relative pt-20 pb-16 px-4 overflow-hidden border-b border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
                <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                        <PenTool className="w-3.5 h-3.5" />
                        <span>The Article Repository</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {category ? (
                            <span className="flex items-center justify-center gap-4">
                                <span className="text-primary truncate">{category}</span>
                                <span className="opacity-20 italic font-light text-4xl md:text-6xl">Intelligence</span>
                            </span>
                        ) : "ARCHIVE PORTAL"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        {category
                            ? `Strategic documentation and architectural insights finalized in the ${category} focus area.`
                            : "Declassified engineering reports, architectural blueprints, and full-stack implementation theories."}
                    </p>
                </div>

                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)]" />
                </div>
            </section>

            {/* Filter Bar */}
            <section className="sticky top-16 z-40 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-start md:justify-center gap-3 min-w-max">
                        <Link
                            href="/blog"
                            className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!category
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                        >
                            <Hash className={`w-3.5 h-3.5 ${!category ? "text-white" : "text-slate-400"}`} />
                            All Domains
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                href={`/blog?category=${cat.label}`}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${category?.toLowerCase() === cat.label.toLowerCase()
                                    ? `bg-white dark:bg-white/10 border-primary shadow-xl dark:shadow-none text-slate-900 dark:text-white`
                                    : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                <cat.icon className={`w-3.5 h-3.5 ${category?.toLowerCase() === cat.label.toLowerCase() ? cat.color : "text-slate-400 opacity-50 grupo-hover:opacity-100 transition-opacity"}`} />
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <main className="max-w-7xl mx-auto px-4 py-20">
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={{ ...blog, category: blog.category ?? undefined }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-white/[0.01]">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 mb-6">
                            <Layers className="w-10 h-10 text-slate-300 dark:text-white/20" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Domain Vacuum Detected</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-4 font-medium">No declassified records found in this specific sector. Our engineers are working on it.</p>
                        <Button asChild variant="outline" className="mt-8 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 shadow-sm">
                            <Link href="/blog">Reset Scientific Scope</Link>
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
