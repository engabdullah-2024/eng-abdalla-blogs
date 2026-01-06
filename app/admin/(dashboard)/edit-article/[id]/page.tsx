import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) notFound();

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
