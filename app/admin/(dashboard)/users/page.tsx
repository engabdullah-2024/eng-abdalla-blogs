"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Loader2,
    MoreVertical,
    Shield,
    User as UserIcon,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface User {
    id: string;
    email: string;
    name: string | null;
    role: "SUPER_ADMIN" | "AUTHOR";
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ id: string, role: string } | null>(null);

    // Action states
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [updatingUser, setUpdatingUser] = useState<{ user: User, nextRole: "SUPER_ADMIN" | "AUTHOR" } | null>(null);
    const [isActionPending, setIsActionPending] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setUsers(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                setCurrentUser(data.user);
                if (data.user?.role === 'SUPER_ADMIN') {
                    fetchUsers();
                } else {
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, []);

    const handleRoleUpdate = async () => {
        if (!updatingUser) return;
        setIsActionPending(true);
        try {
            const res = await fetch(`/api/admin/users/${updatingUser.user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: updatingUser.nextRole }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success(`User role updated to ${updatingUser.nextRole}`);
            setUpdatingUser(null);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        } finally {
            setIsActionPending(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        setIsActionPending(true);
        try {
            const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("User removed from CMS database");
            setDeletingUser(null);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsActionPending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
            </div>
        );
    }

    if (currentUser?.role !== 'SUPER_ADMIN') {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Access Restricted</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your personnel clearance level does not allow access to User Orchestration.</p>
                </div>
                <Button asChild className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs">
                    <Link href="/admin/dashboard">Return to Hub</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
                        <ShieldCheck className="w-3.5 h-3.5" /> System Authority
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">User<br />Orchestration</h1>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] max-w-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                        Authorize roles and manage system access. Note: For full account deletion or identity resets, use your <a href="https://dashboard.clerk.com" target="_blank" className="text-primary underline">Clerk Admin Terminal</a>.
                    </p>
                </div>
            </header>

            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-white/[0.01]">
                            <TableRow className="border-b border-slate-200 dark:border-white/5 hover:bg-transparent">
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Personnel</TableHead>
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Identity</TableHead>
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Clearance</TableHead>
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell text-right">Induction</TableHead>
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Operations</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? users.map((user) => (
                                <TableRow key={user.id} className="border-b border-slate-100 dark:border-white/[0.02] hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 font-black text-primary group-hover:scale-110 transition-transform">
                                                {(user.name || user.email)[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-black text-slate-900 dark:text-white truncate">{user.name || "Anonymous"}</span>
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 md:hidden truncate uppercase tracking-widest">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 px-8 hidden md:table-cell">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.email}</span>
                                    </TableCell>
                                    <TableCell className="py-6 px-8">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-2 ${user.role === "SUPER_ADMIN"
                                                    ? "bg-primary/5 text-primary border-primary/20"
                                                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-transparent"
                                                }`}
                                        >
                                            {user.role === "SUPER_ADMIN" ? "Level 5 Admin" : "Level 2 Author"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-6 px-8 hidden lg:table-cell text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-6 px-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 group">
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] backdrop-blur-xl">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-3 py-2">Orchestration Menu</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/5" />

                                                <DropdownMenuItem
                                                    onClick={() => setUpdatingUser({ user, nextRole: user.role === "SUPER_ADMIN" ? "AUTHOR" : "SUPER_ADMIN" })}
                                                    className="rounded-xl flex items-center justify-between p-3 cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Shield className="w-4 h-4 text-primary" />
                                                        <span className="text-xs font-black uppercase tracking-widest">Flip Clearance</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors">
                                                        {user.role === "SUPER_ADMIN" ? "To Author" : "To Admin"}
                                                    </span>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/5" />

                                                <DropdownMenuItem
                                                    disabled={user.id === currentUser?.id}
                                                    onClick={() => setDeletingUser(user)}
                                                    className="rounded-xl flex items-center gap-3 p-3 cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Terminate Access</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center">
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No system personnel found.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Role Update Confirmation Dialog */}
            <Dialog open={!!updatingUser} onOpenChange={(open) => !open && setUpdatingUser(null)}>
                <DialogContent className="rounded-[2.5rem] p-10 border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] max-w-md">
                    <DialogHeader className="space-y-4">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Shield className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
                            Update Clearance Level?
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed">
                            You are about to change <span className="text-primary font-black">{updatingUser?.user.name}</span>'s authorization to <span className="text-primary font-black">{updatingUser?.nextRole}</span>. This affects all system-wide permissions immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 pt-10">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                            onClick={() => setUpdatingUser(null)}
                        >
                            Abort
                        </Button>
                        <Button
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-primary hover:bg-primary/90"
                            onClick={handleRoleUpdate}
                            disabled={isActionPending}
                        >
                            {isActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Change"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent className="rounded-[2.5rem] p-10 border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] max-w-md">
                    <DialogHeader className="space-y-4">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
                            Terminate Personnel?
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed">
                            This will remove <span className="text-red-500 font-black">{deletingUser?.name}</span> from the local CMS orchestration database. They will lose all authorship histories and dashboard access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 pt-10">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                            onClick={() => setDeletingUser(null)}
                        >
                            Abort
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteUser}
                            disabled={isActionPending}
                        >
                            {isActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Termination"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
