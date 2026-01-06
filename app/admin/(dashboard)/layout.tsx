import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="container mx-auto p-6 md:p-10 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
