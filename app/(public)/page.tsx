import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PenTool, LayoutDashboard, Sparkles, Code2, Zap, Rocket, Terminal } from "lucide-react";
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
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#030303] selection:bg-primary/30 transition-colors duration-500">
            {/* Cosmic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 dark:bg-primary/10 blur-[130px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-purple-600/10 blur-[130px] rounded-full animate-pulse " style={{ animationDelay: '2s' }} />
            </div>

            {/* Premium Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 md:pt-48 md:pb-32 px-4 text-center overflow-hidden">
                <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-primary-foreground/80 mb-6 backdrop-blur-md">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        <span>Engineering the Next Generation of Web</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] flex flex-col items-center">
                        SOLVING <br />
                        <span className="relative inline-block mt-4">
                            COMPLEXITY
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-transparent rounded-full opacity-50" />
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium pt-4">
                        A specialized repository for high-performance architecture, clean code practices, and the future of digital product engineering.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                        <Button asChild size="lg" className="rounded-2xl h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95">
                            <Link href="/blog">Archive Portal <Rocket className="ml-2 w-5 h-5" /></Link>
                        </Button>
                        <SignedIn>
                            <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-12 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-sm transition-all font-bold text-lg">
                                <Link href="/admin/dashboard">Access Control</Link>
                            </Button>
                        </SignedIn>
                        <SignedOut>
                            <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-12 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-sm transition-all font-bold text-lg">
                                <Link href="/admin/login">Join Laboratory</Link>
                            </Button>
                        </SignedOut>
                    </div>
                </div>
            </section>

            {/* Strategic Pillars (SaaS Style) */}
            <section className="relative z-10 container mx-auto px-4 py-24">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Strategic Pillars</h2>
                    <p className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Core Architectural Values</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { icon: Code2, title: "Scalable Core", desc: "Building systems that don't just work, but scale effortlessly as your demand grows.", color: "text-blue-500" },
                        { icon: Zap, title: "Performance First", desc: "Every millisecond counts. Optimization is woven into the very fabric of my design approach.", color: "text-amber-500" },
                        { icon: ShieldCheck, title: "Ironclad Security", desc: "Modern authentication and data protection strategies for peace of mind in a digital age.", color: "text-emerald-500" }
                    ].map((pillar, idx) => (
                        <div key={idx} className="group relative p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-2xl transition-all hover:translate-y-[-8px] hover:border-primary/30">
                            <div className={`mb-6 inline-flex p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm ${pillar.color}`}>
                                <pillar.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{pillar.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {pillar.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Platform Control Gateway */}
            <section className="relative z-10 container mx-auto px-4 py-32 bg-slate-50/30 dark:bg-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {/* Admin Dashboard Card */}
                    <div className="group relative overflow-hidden rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 backdrop-blur-3xl shadow-2xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:shadow-primary/10">
                        <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
                            <LayoutDashboard className="w-64 h-64 text-primary rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 border border-primary/20 text-primary shadow-inner">
                                <LayoutDashboard className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Central Operations</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-4 max-w-xs">
                                    Strategic management of the entire ecosystem. Precision controls for user orchestration and system-wide visibility.
                                </p>
                            </div>
                            <Button asChild variant="link" className="p-0 text-primary font-black text-lg group-hover:gap-3 transition-all h-auto">
                                <Link href="/admin/dashboard" className="flex items-center gap-2">
                                    Initiate Command <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Author Dashboard Card */}
                    <div className="group relative overflow-hidden rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 backdrop-blur-3xl shadow-2xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:shadow-purple-500/10">
                        <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
                            <PenTool className="w-64 h-64 text-purple-500 -rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-purple-500/10 border border-purple-500/20 text-purple-500 shadow-inner">
                                <PenTool className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Content Foundry</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-4 max-w-xs">
                                    High-fidelity environment for thought leadership. Transform complex theories into digestible digital narratives.
                                </p>
                            </div>
                            <Button asChild variant="link" className="p-0 text-purple-500 font-black text-lg group-hover:gap-3 transition-all h-auto">
                                <Link href="/admin/dashboard" className="flex items-center gap-2">
                                    Commence Creation <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Articles Redux */}
            <section className="relative z-10 container mx-auto px-4 py-32 space-y-24">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 max-w-6xl mx-auto border-l-4 border-primary pl-10">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">THE <br /> INTELLIGENCE</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Recently declassified from the laboratory</p>
                    </div>
                    <Button variant="ghost" asChild className="group text-primary hover:text-primary/90 hover:bg-primary/5 transition-all text-xl font-black p-0 h-auto">
                        <Link href="/blog" className="flex items-center gap-3 underline decoration-primary/30 underline-offset-8 decoration-2 hover:decoration-primary">
                            FULL REPOSITORY <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-3" />
                        </Link>
                    </Button>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-3xl max-w-4xl mx-auto">
                        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 mb-8 animate-bounce">
                            <Sparkles className="w-12 h-12 text-primary/40" />
                        </div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">Studio is in Deep Workspace</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xl max-w-md mx-auto mt-6 font-medium">New architectural frameworks are being documented. System status: Processing.</p>
                    </div>
                )}
            </section>

            {/* SaaS Style Footer CTA */}
            <section className="relative z-10 container mx-auto px-4 py-24 text-center">
                <div className="max-w-4xl mx-auto p-16 rounded-[4rem] bg-primary relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 transition-opacity group-hover:opacity-70" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-primary-foreground leading-tight">Ready to see deeper into the architecture?</h2>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-16 px-12 bg-white text-primary hover:bg-white/90 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">
                                <Link href="/blog">Begin Scientific Audit</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
