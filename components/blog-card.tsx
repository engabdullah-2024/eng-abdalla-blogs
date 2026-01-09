"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
    blog: {
        id: string;
        title: string;
        description: string;
        createdAt: Date | string;
        coverImage?: string | null;
        authorName: string;
        category?: string;
    };
}

export function BlogCard({ blog }: BlogCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <Link href={`/blog/${blog.id}`} className="block h-full">
                <Card className="h-full overflow-hidden border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 group h-full flex flex-col rounded-[2.5rem]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                        {blog.coverImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-white/20">
                                <span className="text-xs font-black uppercase tracking-widest italic">No Data Stream</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {blog.category && (
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground rounded-lg shadow-lg">
                                    {blog.category}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/60">
                                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                <span className="h-1 w-1 rounded-full bg-primary/30" />
                                <span className="text-slate-500 dark:text-slate-400">{blog.authorName}</span>
                            </div>
                            <h3 className="text-2xl font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                {blog.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm font-medium leading-relaxed">
                                {blog.description}
                            </p>
                        </div>

                        <div className="pt-4 flex items-center text-primary font-black text-xs uppercase tracking-widest gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Read Declassified Report <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}
