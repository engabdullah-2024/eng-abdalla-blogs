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

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your content showing {blogs.length} articles.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/new-article">
                        <Plus className="mr-2 h-4 w-4" /> New Article
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
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
                            blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {blog.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={blog.published ? "default" : "secondary"}>
                                            {blog.published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/blog/${blog.id}`} target="_blank">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
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
    );
}
