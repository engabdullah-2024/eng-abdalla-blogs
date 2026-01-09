import { auth } from "@clerk/nextjs/server";

export async function isAuthenticated() {
    const session = await auth();
    return !!session.userId;
}
