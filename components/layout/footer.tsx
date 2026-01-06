import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <span className="text-lg font-bold">Eng Abdalla Blogs</span>
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            Built with Next.js, Tailwind, and Love.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="https://github.com/engabdalla" target="_blank" className="text-sm font-medium hover:underline">
                            GitHub
                        </Link>
                        <Link href="https://twitter.com/engabdalla" target="_blank" className="text-sm font-medium hover:underline">
                            Twitter
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Eng Abdalla. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
