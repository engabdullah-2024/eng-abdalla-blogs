"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface LikeButtonProps {
    blogId: string;
    initialCount?: number;
}

export function LikeButton({ blogId, initialCount = 0 }: LikeButtonProps) {
    const { user: clerkUser } = useUser();
    const [count, setCount] = useState(initialCount);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await fetch(`/api/blogs/${blogId}/like`);
                const data = await res.json();
                if (!data.error) {
                    setCount(data.count);
                    setIsLiked(data.isLiked);
                }
            } catch (error) {
                console.error("Failed to fetch like status");
            } finally {
                setLoading(false);
            }
        };

        fetchLikeStatus();
    }, [blogId]);

    const handleLike = async () => {
        if (!clerkUser) {
            toast.error("Please sign in to like articles");
            return;
        }

        // Optimistic UI update
        const prevIsLiked = isLiked;
        const prevCount = count;
        setIsLiked(!prevIsLiked);
        setCount(prevIsLiked ? prevCount - 1 : prevCount + 1);

        try {
            const res = await fetch(`/api/blogs/${blogId}/like`, {
                method: "POST",
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Sync with server response
            setIsLiked(data.liked);
        } catch (error: any) {
            // Revert on error
            setIsLiked(prevIsLiked);
            setCount(prevCount);
            toast.error(error.message || "Action failed");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl transition-all h-10 px-4 ${isLiked
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
        >
            <Heart className={`w-4 h-4 transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
            <span className="font-black text-xs uppercase tracking-widest">{count} {count === 1 ? "Like" : "Likes"}</span>
        </Button>
    );
}
