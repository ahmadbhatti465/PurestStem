import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { buildProductData } from "@/lib/product-input";
import { recordProductSlugRedirect } from "@/lib/redirects";
import {
  requireApiSection,
  logAdminAction,
  isUniqueViolation,
  isNotFound,
  readJson,
} from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("products");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("products");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Optimistic concurrency: refuse to overwrite someone else's newer save.
    if (
      typeof body.expectedUpdatedAt === "string" &&
      new Date(body.expectedUpdatedAt).getTime() !== existing.updatedAt.getTime()
    ) {
      return NextResponse.json(
        {
          error:
            "This product was changed by someone else since you opened it. Reload the page to see their changes before saving.",
          conflict: true,
        },
        { status: 409 }
      );
    }

    const parsed = buildProductData(body, existing);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { data } = parsed;

    const [slugTaken, skuTaken, category] = await Promise.all([
      data.slug !== existing.slug
        ? prisma.product.findUnique({ where: { slug: data.slug }, select: { id: true, name: true } })
        : null,
      data.sku && data.sku !== existing.sku
        ? prisma.product.findUnique({ where: { sku: data.sku }, select: { id: true, name: true } })
        : null,
      prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } }),
    ]);
    if (slugTaken && slugTaken.id !== id) {
      return NextResponse.json(
        { error: `A product with slug "${data.slug}" already exists ("${slugTaken.name}").` },
        { status: 409 }
      );
    }
    if (skuTaken && skuTaken.id !== id) {
      return NextResponse.json(
        { error: `A product with SKU "${data.sku}" already exists ("${skuTaken.name}").` },
        { status: 409 }
      );
    }
    if (!category) {
      return NextResponse.json({ error: "The selected category no longer exists." }, { status: 400 });
    }

    const product = await prisma.product.update({ where: { id }, data });

    // Only record the redirect once the new slug is actually saved.
    if (product.slug !== existing.slug) {
      await recordProductSlugRedirect(existing.slug, product.slug);
    }

    refreshStorefront();
    await logAdminAction(auth.session, "update", "product", id, {
      name: product.name,
      ...(existing.price !== product.price ? { priceFrom: existing.price, priceTo: product.price } : {}),
      ...(existing.stock !== product.stock ? { stockFrom: existing.stock, stockTo: product.stock } : {}),
      ...(existing.status !== product.status ? { statusFrom: existing.status, statusTo: product.status } : {}),
      ...(existing.slug !== product.slug ? { slugFrom: existing.slug, slugTo: product.slug } : {}),
    });
    return NextResponse.json(product);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "Slug or SKU is already in use." }, { status: 409 });
    }
    console.error("Update product failed:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/**
 * Order lines keep a snapshot of the product's name/SKU/weight, so deleting a
 * product no longer erases it from order history or invoices.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("products");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true, sku: true, weight: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.$transaction([
      // Backfill snapshots for any order lines created before snapshots existed.
      prisma.orderItem.updateMany({
        where: { productId: id, productName: null },
        data: { productName: product.name, productSku: product.sku, productWeight: product.weight },
      }),
      prisma.product.delete({ where: { id } }),
    ]);

    refreshStorefront();
    await logAdminAction(auth.session, "delete", "product", id, { name: product.name, slug: product.slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    console.error("Delete product failed:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
