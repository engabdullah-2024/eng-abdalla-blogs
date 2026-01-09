"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("AUTHOR");

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (currentUser?.role !== 'SUPER_ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-muted-foreground">This area is reserved for system administrators only.</p>
                <Button asChild>
                    <Link href="/admin/dashboard">Go back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, role }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("User created successfully");
            setIsDialogOpen(false);
            fetchUsers();
            // Reset form
            setEmail("");
            setPassword("");
            setName("");
            setRole("AUTHOR");
        } catch (error: any) {
            toast.error(error.message || "Failed to create user");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground text-sm">Manage authors and administrators.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <UserPlus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="AUTHOR">Author</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create User"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px]">Name</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{user.name || "N/A"}</span>
                                            <span className="text-[10px] text-muted-foreground md:hidden">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"} className="text-[10px] md:text-xs">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>

    );
}
