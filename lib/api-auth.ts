import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    return !!verifyToken(token);
}
