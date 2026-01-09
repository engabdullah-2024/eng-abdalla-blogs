import { prisma as db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const isSuperAdmin = email === superAdminEmail;

    // Check if user exists in DB
    let dbUser = await db.user.findUnique({
        where: { clerkId: user.id },
    });

    if (!dbUser) {
        // Create user
        dbUser = await db.user.create({
            data: {
                clerkId: user.id,
                email: email,
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
                role: isSuperAdmin ? "SUPER_ADMIN" : "AUTHOR",
            },
        });
    } else {
        // Check if role needs update (if they just became superadmin)
        if (isSuperAdmin && dbUser.role !== "SUPER_ADMIN") {
            dbUser = await db.user.update({
                where: { clerkId: user.id },
                data: { role: "SUPER_ADMIN" },
            });
        }
    }

    return dbUser;
}
