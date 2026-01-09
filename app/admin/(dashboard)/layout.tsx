import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto w-full flex flex-col">
                <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <MobileNav />
                        <Link href="/" className="hidden sm:flex items-center gap-2 group transition-colors hover:text-primary">
                            <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                <span className="text-xs font-bold">Back to Home</span>
                            </Button>
                        </Link>
                        <div className="sm:hidden h-4 w-[1px] bg-white/10 mx-1" />
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="hidden lg:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <ModeToggle />
                    </div>
                </header>

                <div className="container mx-auto p-6 md:p-10 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
