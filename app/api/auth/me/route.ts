import { NextResponse } from 'next/server'
import { syncUser } from '@/lib/sync-user'

export async function GET() {
    try {
        const user = await syncUser();

        if (!user) {
            return NextResponse.json({ user: null })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ user: null })
    }
}
