import { BlogForm } from "@/components/admin/blog-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewArticlePage() {
    const user = await getCurrentUser();

    return <BlogForm initialAuthorName={user?.name || user?.email.split('@')[0]} />;
}

