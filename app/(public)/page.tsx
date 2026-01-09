import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PenTool, LayoutDashboard, Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    let blogs: any[] = [];
    try {
        blogs = await prisma.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 3,
        });
    } catch (e) {
        console.error("Database connection error:", e);
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#030303] selection:bg-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center py-24 md:py-40 px-4 text-center space-y-10 overflow-hidden">
                <div className="space-y-6 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-foreground/80 mb-4 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Empowering Digital Narratives</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
                        CRAFTING <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                            EXPERIENCES
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        A modern ecosystem for high-performance content creation. Built for creators who demand speed, security, and elegance.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button asChild size="lg" className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all hover:scale-105">
                        <Link href="/blog">Explore Articles</Link>
                    </Button>
                    <SignedOut>
                        <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-10 border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                            <Link href="/admin/login">Join Workshop</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-10 border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                            <Link href="/admin/dashboard">Go to Dashboard</Link>
                        </Button>
                    </SignedIn>
                </div>
            </section>

            {/* Dashboard Selection Portal */}
            <section className="relative z-10 container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Admin Dashboard Card */}
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-primary/50">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-32 h-32 text-primary" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Admin Dashboard</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Complete control over the platform. Manage users, site configurations, and oversee all system analytics.
                            </p>
                            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all pt-4">
                                Enter Portal <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Author Dashboard Card */}
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-purple-500/50">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PenTool className="w-32 h-32 text-purple-500" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
                                <PenTool className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Author Workshop</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Specialized workspace for creators. Draft, edit, and publish your insights with our high-fidelity editor.
                            </p>
                            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-purple-500 font-bold group-hover:gap-4 transition-all pt-4">
                                Start Writing <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Articles */}
            <section className="relative z-10 container mx-auto px-4 py-20 space-y-16">
                <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">THE LATEST</h2>
                        <p className="text-muted-foreground font-medium">Curated insights from our premier authors</p>
                    </div>
                    <Button variant="ghost" asChild className="group text-primary hover:text-primary/80 hover:bg-primary/5 transition-all text-lg font-bold">
                        <Link href="/blog">
                            View Archive <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </Button>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-lg">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6">
                            <Sparkles className="w-10 h-10 text-white/20" />
                        </div>
                        <p className="text-2xl font-bold text-white">Silence in the Studio</p>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">New insights are currently being crafted. Check back soon for the latest updates.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
