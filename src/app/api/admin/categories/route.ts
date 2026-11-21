import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { slugify } from "@/lib/slugify";
import { requireApiSection, logAdminAction, isUniqueViolation, readJson } from "@/lib/admin-auth";
import { str } from "@/lib/admin-input";

export async function POST(req: NextRequest) {
  const auth = await requireApiSection("categories");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  const name = str(body?.name, 120);
  const slug = slugify(str(body?.slug) || name || "");

  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  if (!slug) return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });

  try {
    const category = await prisma.category.create({
      data: { name, slug, description: str(body?.description, 2000) },
    });
    refreshStorefront();
    await logAdminAction(auth.session, "create", "category", category.id, { name, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }
    console.error("Create category failed:", error);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}
