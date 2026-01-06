"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PenSquare, LogOut, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "New Article", href: "/admin/new-article", icon: PenSquare },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

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

    return (
        <div className="flex h-screen flex-col border-r bg-muted/20 w-64 hidden md:flex shrink-0">
            <div className="p-6">
                <h2 className="text-xl font-bold">CMS Panel</h2>
                <p className="text-xs text-muted-foreground">Eng Abdalla Blogs</p>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <Globe className="h-4 w-4" />
                        View Live Site
                    </Link>
                </div>
            </nav>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
