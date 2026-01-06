"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Eng Abdalla
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative",
                                    pathname === item.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                                {pathname === item.href && (
                                    <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Admin
                    </Link>
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
