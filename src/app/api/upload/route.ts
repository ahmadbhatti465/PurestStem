import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "blog";
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalName = sanitizeFilename(file.name);
    const filename = `${sanitizedFolder}/${Date.now()}-${originalName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({
        url: blob.url,
        filename: originalName,
        size: file.size,
        type: file.type,
      });
    }

    // Local filesystem fallback for development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const localFilename = `${Date.now()}-${originalName}`;
    const filePath = path.join(uploadDir, localFilename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${sanitizedFolder}/${localFilename}`;
    return NextResponse.json({
      url,
      filename: originalName,
      size: file.size,
      type: file.type,
    });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
