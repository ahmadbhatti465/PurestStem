import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { slugify } from "@/lib/slugify";
import {
  requireApiSection,
  logAdminAction,
  isUniqueViolation,
  isNotFound,
  readJson,
} from "@/lib/admin-auth";
import { str } from "@/lib/admin-input";
import { recordCategorySlugRedirect } from "@/lib/redirects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("categories");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("categories");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  const name = str(body?.name, 120);
  const slug = slugify(str(body?.slug) || name || "");
  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  if (!slug) return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });

  try {
    const { id } = await params;
    const previous = await prisma.category.findUnique({ where: { id }, select: { slug: true } });
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description: str(body?.description, 2000) },
    });
    if (previous && previous.slug !== category.slug) {
      await recordCategorySlugRedirect(previous.slug, category.slug);
    }
    refreshStorefront();
    await logAdminAction(auth.session, "update", "category", id, { name, slug });
    return NextResponse.json(category);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    console.error("Update category failed:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

/**
 * Deleting a category would cascade-delete its products in the database, so
 * it is refused while any product still uses it. Move or delete those
 * products first.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("categories");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      select: { name: true, _count: { select: { products: true } } },
    });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: `"${category.name}" still has ${category._count.products} product(s). Move them to another category or delete them first.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    refreshStorefront();
    await logAdminAction(auth.session, "delete", "category", id, { name: category.name });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category failed:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
