import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/admin/login");
    }

    const whereClause = user.role === 'AUTHOR' ? { authorId: user.id } : {};

    const blogs = await prisma.blog.findMany({
        where: whereClause as any,
        orderBy: { createdAt: "desc" },
    });



    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 rounded-xl border border-primary/10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                        Welcome, <span className="text-primary">{user.name || user.email.split('@')[0]}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium text-sm md:text-base">
                        You have <span className="text-white">{blogs.length}</span> active articles in your workshop.
                    </p>
                </div>
                <Button asChild size="lg" className="w-full md:w-auto shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    <Link href="/admin/new-article">
                        <Plus className="mr-2 h-5 w-5" /> Write New Article
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No articles found. Create your first one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog: { id: string; title: string; published: boolean; createdAt: Date }) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium max-w-[300px] truncate">
                                            {blog.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={blog.published ? "default" : "secondary"}>
                                                {blog.published ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-1 md:gap-2">
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                <Link href={`/blog/${blog.id}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                <Link href={`/admin/edit-article/${blog.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteButton id={blog.id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
