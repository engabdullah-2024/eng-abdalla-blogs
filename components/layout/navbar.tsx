"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-2xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="group flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                            A
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            Abdalla<span className="text-primary not-italic">Blogs</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative py-1",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-slate-500 dark:text-slate-400"
                                )}
                            >
                                {item.name}
                                {pathname === item.href && (
                                    <span className="absolute -bottom-1 left-0 w-[40%] h-[2px] bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 border-r border-slate-200 dark:border-white/10 pr-6 mr-2">
                        <SignedIn>
                            <Link href="/admin/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">
                                Control Panel
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">
                                Authenticate
                            </Link>
                        </SignedOut>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
