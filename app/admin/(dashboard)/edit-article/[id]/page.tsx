import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/admin/login");

    const { id } = await params;
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) notFound();

    // Check ownership for authors
    if (user.role === 'AUTHOR' && (blog as any).authorId !== user.id) {
        notFound();
    }


    const initialData = {
        id: blog.id,
        title: blog.title,
        description: blog.description,
        content: blog.content,
        coverImage: blog.coverImage || "",
        published: blog.published,
        authorName: blog.authorName || "Eng Abdalla",
        category: blog.category || "Web Dev",
    };

    return <BlogForm initialData={initialData} isEdit />;
}
