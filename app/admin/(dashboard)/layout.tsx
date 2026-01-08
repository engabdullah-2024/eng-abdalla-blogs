import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";



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
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Active Session</span>
                        </div>
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
