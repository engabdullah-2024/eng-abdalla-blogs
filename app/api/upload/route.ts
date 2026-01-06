import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from '@/lib/api-auth'

export async function POST(req: Request) {
    try {
        const isAuth = await isAuthenticated()
        if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        await writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
