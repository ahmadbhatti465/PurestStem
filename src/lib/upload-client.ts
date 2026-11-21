import { MAX_UPLOAD_BYTES } from "@/lib/admin-roles";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export type UploadResult =
  | { ok: true; url: string; width: number | null; height: number | null; size: number }
  | { ok: false; error: string };

/** Reads an image's pixel size in the browser, releasing the temporary object URL. */
export function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Uploads one image to /api/upload with the same limits the server enforces,
 * so oversize or unsupported files fail fast with a clear message.
 */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: `"${file.name}" isn't a JPG, PNG, WebP, AVIF or GIF image.` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      error: `"${file.name}" is ${mb} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB, so please compress it first.`,
    };
  }

  const size = await readImageSize(file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body: formData });
  } catch {
    return { ok: false, error: "Network error while uploading. Check your connection and try again." };
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) {
    const fallback =
      res.status === 413
        ? "Image is too large to upload."
        : res.status === 403
          ? "You don't have permission to upload images."
          : `Upload failed (error ${res.status}).`;
    return { ok: false, error: data?.error || fallback };
  }
  return { ok: true, url: data.url, width: size?.width ?? null, height: size?.height ?? null, size: file.size };
}
