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
    loginType: z.enum(["ADMIN", "AUTHOR"]),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<"ADMIN" | "AUTHOR">("ADMIN");

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
            loginType: "ADMIN",
        },
    });

    // Update form value when state changes
    useEffect(() => {
        form.setValue("loginType", loginType);
    }, [loginType, form]);

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

            toast.success(`Welcome back!`);
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
        <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1 pb-8">
                    <CardTitle className="text-3xl font-bold text-center tracking-tight text-white italic">
                        {loginType === "ADMIN" ? "Admin Panel" : "Author Portal"}
                    </CardTitle>
                    <p className="text-center text-sm text-muted-foreground">
                        Please select your access level to continue
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Role Selection Tabs */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                        <button
                            onClick={() => setLoginType("ADMIN")}
                            className={cn(
                                "py-2 text-xs font-semibold rounded-md transition-all duration-300",
                                loginType === "ADMIN"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            Log in as Admin
                        </button>
                        <button
                            onClick={() => setLoginType("AUTHOR")}
                            className={cn(
                                "py-2 text-xs font-semibold rounded-md transition-all duration-300",
                                loginType === "AUTHOR"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            Log in as Author
                        </button>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
                                                {...field}
                                            />
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
                                        <FormLabel className="text-white/80">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-white/5 border-white/10 text-white h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-11 text-sm font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[1]" disabled={loading}>
                                {loading ? "Authenticating..." : `Access ${loginType === "ADMIN" ? "Admin" : "Author"} Dashboard`}
                            </Button>

                            <div className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t border-white/5">
                                Secured Access Gateway • Eng Abdalla Blogs
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

