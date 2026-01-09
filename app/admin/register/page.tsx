"use client";

import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                            card: "bg-card border-border shadow-2xl",
                            headerTitle: "text-foreground font-bold",
                            headerSubtitle: "text-muted-foreground",
                            socialButtonsBlockButton: "border-border bg-background hover:bg-muted text-foreground",
                            dividerLine: "bg-border",
                            dividerText: "text-muted-foreground",
                            formFieldLabel: "text-foreground",
                            formFieldInput: "bg-background border-border text-foreground",
                            footerActionLink: "text-primary hover:text-primary/90"
                        }
                    }}
                    fallbackRedirectUrl="/admin/dashboard"
                    signInUrl="/admin/login"
                />
            </div>
        </div>
    );
}
