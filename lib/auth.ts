import { syncUser } from "./sync-user";

export interface UserPayload {
    id: string;
    email: string;
    name?: string | null;
    role: 'SUPER_ADMIN' | 'AUTHOR';
}

/**
 * @deprecated Use syncUser from @/lib/sync-user instead
 */
export const getCurrentUser = async () => {
    const user = await syncUser();
    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'SUPER_ADMIN' | 'AUTHOR'
    } as UserPayload;
}

// Keep these for now if needed, but they are not used with Clerk
export const verifyToken = (token: string) => null;
export const signToken = (payload: any) => "";
export const hashPassword = async (password: string) => "";
export const comparePassword = async (password: string, hash: string) => false;

