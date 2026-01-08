"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PenSquare, LogOut, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function SidebarContent({ onInteract }: { onInteract?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ role: string; name?: string | null; email?: string } | null>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            toast.success("Logged out");
            router.push("/admin/login");
            router.refresh();
        } catch {
            toast.error("Logout failed");
        }
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "New Article", href: "/admin/new-article", icon: PenSquare },
    ];

    if (user?.role === 'SUPER_ADMIN') {
        navItems.push({ name: "Users", href: "/admin/users", icon: Users });
    }

    return (
        <div className="flex h-full flex-col">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold tracking-tight text-white italic">CMS Panel</h2>
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {(user?.name || user?.email || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate text-white">
                            {user?.name || user?.email?.split('@')[0] || "Loading..."}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            {user?.role === 'SUPER_ADMIN' ? 'System Administrator' : 'Content Author'}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onInteract}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-white/5">
                    <Link
                        href="/"
                        target="_blank"
                        onClick={onInteract}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <Globe className="h-4 w-4" />
                        View Live Site
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                    onClick={() => {
                        handleLogout();
                        onInteract?.();
                    }}
                >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span className="font-semibold">Sign Out</span>
                </Button>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-muted/20 shrink-0">
            <SidebarContent />
        </aside>
    );
}
