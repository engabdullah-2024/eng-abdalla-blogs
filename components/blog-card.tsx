"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

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
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link href={`/blog/${blog.id}`}>
                <Card className="h-full overflow-hidden border-border/40 bg-card/50 transition-colors hover:bg-card/80 hover:border-primary/50 group">
                    <div className="relative aspect-video w-full overflow-hidden">
                        {blog.coverImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground/50">
                                <span className="text-sm">No Cover Image</span>
                            </div>
                        )}
                        {blog.category && (
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded">
                                    {blog.category}
                                </span>
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span>•</span>
                            <span>{blog.authorName}</span>
                        </div>
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {blog.title}
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                            {blog.description}
                        </p>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
