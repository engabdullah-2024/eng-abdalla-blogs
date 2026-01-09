"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, MessageSquare, CornerDownRight, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
        clerkId: string;
    };
    replies?: Comment[];
}

interface CommentSectionProps {
    blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
    const { user: clerkUser } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/blogs/${blogId}/comments`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clerkUser) {
            toast.error("Please sign in to comment");
            return;
        }

        if (content.trim().length === 0) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/blogs/${blogId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    parentId: replyTo?.id || null
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success(replyTo ? "Reply posted" : "Comment posted");
            setContent("");
            setReplyTo(null);
            fetchComments();
        } catch (error: any) {
            toast.error(error.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Intelligence Stream</p>
            </div>
        );
    }

    return (
        <section className="space-y-12">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Personnel Discussion</h2>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{comments.length} Reports logged</p>
                </div>
            </div>

            {/* Comment Form */}
            <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 rounded-[2rem] space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        {replyTo ? `Replying to @${replyTo.name}` : "Log New Insight"}
                    </h3>
                    {replyTo && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(null)}
                            className="text-[10px] font-black uppercase tracking-widest h-8"
                        >
                            Cancel Reply
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder={clerkUser ? "System analysis and architectural feedback..." : "Sign in to join the discussion"}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={!clerkUser || submitting}
                        className="min-h-[120px] rounded-2xl bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 focus:ring-primary/20 p-6 font-medium text-slate-700 dark:text-slate-300 transition-all text-sm"
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            <User className="w-3 h-3" />
                            {clerkUser ? clerkUser.fullName : "Guest Terminal"}
                        </div>
                        <Button
                            type="submit"
                            disabled={!clerkUser || submitting || content.trim().length === 0}
                            className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Deploy Insight</>}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-10">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="space-y-6">
                            <CommentItem
                                comment={comment}
                                onReply={(id, name) => {
                                    setReplyTo({ id, name });
                                    window.scrollTo({ top: document.querySelector('form')?.offsetTop ? document.querySelector('form')!.offsetTop - 200 : 0, behavior: 'smooth' });
                                }}
                            />

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-8 md:ml-16 space-y-6 border-l-2 border-slate-200 dark:border-white/5 pl-8 md:pl-10">
                                    {comment.replies.map((reply) => (
                                        <CommentItem key={reply.id} comment={reply} isReply />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">No personnel activity detected in this sector yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function CommentItem({ comment, onReply, isReply = false }: { comment: Comment, onReply?: (id: string, name: string) => void, isReply?: boolean }) {
    return (
        <div className={cn(
            "group relative p-6 rounded-[2rem] transition-all",
            isReply ? "bg-slate-50/30 dark:bg-white/[0.01]" : "bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03] shadow-sm hover:shadow-md"
        )}>
            <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-[10px] text-primary">
                    {(comment.user.name || "A")[0].toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                {comment.user.name || "Anonymous Personnel"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        {onReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReply(comment.id, comment.user.name || "Anonymous")}
                                className="h-8 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                            >
                                <CornerDownRight className="w-3 h-3 mr-1.5" /> Reply
                            </Button>
                        )}
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
}
