import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123456789'

export interface UserPayload {
    id: string;
    email: string;
    name?: string | null;
    role: 'SUPER_ADMIN' | 'AUTHOR';
}


export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const signToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload
    } catch (error) {
        return null
    }
}

export const getCurrentUser = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null

    return verifyToken(token)
}

