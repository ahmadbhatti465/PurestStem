import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireApiSection, logAdminAction } from "@/lib/admin-auth";
import { MAX_UPLOAD_BYTES } from "@/lib/admin-roles";

const ALLOWED_FOLDERS = new Set(["blog", "products", "authors", "categories"]);

/**
 * Raster image types only. SVG is excluded on purpose: it can carry script.
 * The type is decided from the file's leading bytes, not the browser's claim.
 */
function detectImageType(bytes: Uint8Array): { ext: string; mime: string } | null {
  const starts = (sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b);
  if (starts([0xff, 0xd8, 0xff])) return { ext: "jpg", mime: "image/jpeg" };
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { ext: "png", mime: "image/png" };
  if (starts([0x47, 0x49, 0x46, 0x38])) return { ext: "gif", mime: "image/gif" };
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) {
    return { ext: "webp", mime: "image/webp" };
  }
  // ISO-BMFF: "ftyp" at offset 4 followed by an AVIF brand.
  if (starts([0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    if (brand === "avif" || brand === "avis") return { ext: "avif", mime: "image/avif" };
  }
  return null;
}

function baseName(name: string): string {
  const withoutExt = name.replace(/\.[^.]*$/, "");
  return withoutExt.replace(/[^a-zA-Z0-9\-_]/g, "_").slice(0, 80) || "image";
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSection("uploads");
  if (!auth.ok) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderInput = String(formData.get("folder") || "blog");
    const folder = ALLOWED_FOLDERS.has(folderInput) ? folderInput : "blog";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `Image is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB). Please compress it first.` },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectImageType(buffer);
    if (!type) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, AVIF or GIF images are allowed." },
        { status: 415 }
      );
    }

    const storedName = `${Date.now()}-${baseName(file.name)}.${type.ext}`;

    let url: string;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${storedName}`, buffer, {
        access: "public",
        addRandomSuffix: false,
        contentType: type.mime,
      });
      url = blob.url;
    } else {
      // Local filesystem fallback for development
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, storedName), buffer);
      url = `/uploads/${folder}/${storedName}`;
    }

    await logAdminAction(auth.session, "upload", "file", null, { url, size: file.size });
    return NextResponse.json({ url, filename: storedName, size: file.size, type: type.mime });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
