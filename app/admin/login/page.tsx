"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSetup = async () => {
            try {
                const res = await fetch("/api/auth/check-setup");
                const data = await res.json();
                if (!data.isSetup) {
                    toast.info("First time setup required.");
                    router.push("/admin/register");
                }
            } catch (err) {
                console.error("Failed to check setup status", err);
            }
        };
        checkSetup();
    }, [router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            toast.success("Welcome back, Eng Abdalla!");
            router.push("/admin/dashboard");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Authenticating..." : "Login"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground mt-4">
                                First time here? <Link href="/admin/register" className="text-primary hover:underline">Setup Account</Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
