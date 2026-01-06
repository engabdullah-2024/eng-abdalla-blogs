"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UploadCloud } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    content: z.string().min(1, "Content is required"),
    coverImage: z.string(),
    published: z.boolean(),
    authorName: z.string(),
    category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string;
        content: string;
        coverImage: string;
        published: boolean;
        authorName: string;
        category?: string;
    };
    isEdit?: boolean;
}

export function BlogForm({ initialData, isEdit }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            category: initialData.category || "Web Dev"
        } : {
            title: "",
            description: "",
            content: "",
            coverImage: "",
            published: false,
            authorName: "Eng Abdalla",
            category: "Web Dev",
        },
    });

    async function onSubmit(values: FormValues) {
        setLoading(true);
        try {
            const url = isEdit ? `/api/blogs/${initialData?.id}` : "/api/blogs";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success(isEdit ? "Article updated" : "Article created");
            router.push("/admin/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Error saving article");
        } finally {
            setLoading(false);
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                form.setValue("coverImage", data.url);
                toast.success("Image uploaded");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
                        <h2 className="text-2xl font-bold">{isEdit ? "Edit Article" : "New Article"}</h2>
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-lg">
                                <Switch
                                    checked={form.watch("published")}
                                    onCheckedChange={(c) => form.setValue("published", c)}
                                />
                                <span className="text-sm font-medium">
                                    {form.watch("published") ? "Published" : "Draft"}
                                </span>
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Article"}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Metadata & Settings */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Article Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="Web Dev">Web Dev</option>
                                                <option value="AI">AI</option>
                                                <option value="FullStack">FullStack</option>
                                                <option value="Tech">Tech</option>
                                                <option value="Cloud">Cloud</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Short description..." className="h-24 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="coverImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex gap-2">
                                                    <Input placeholder="Image URL" {...field} />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-10 overflow-hidden"
                                                            onChange={handleFileUpload}
                                                            accept="image/*"
                                                            title="Upload Image"
                                                        />
                                                        <Button type="button" variant="outline" size="icon" disabled={uploading}>
                                                            <UploadCloud className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {field.value ? (
                                                    <div className="aspect-video w-full overflow-hidden rounded-md border text-center relative group">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video w-full bg-muted/40 rounded-md border border-dashed flex items-center justify-center text-muted-foreground text-xs">
                                                        No Cover Image
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Right Column: Editor & Preview */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Content (Markdown)</FormLabel>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(!preview)}>
                                    {preview ? "Edit" : "Preview"}
                                </Button>
                            </div>

                            {preview ? (
                                <div className="min-h-[500px] border rounded-md p-4 bg-card prose dark:prose-invert max-w-none overflow-y-auto max-h-[70vh]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {form.watch("content")}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your article here..."
                                                    className="min-h-[500px] font-mono text-sm leading-relaxed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div >
    )
}
