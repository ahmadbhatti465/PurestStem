import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { buildProductData } from "@/lib/product-input";
import { requireApiSection, logAdminAction, isUniqueViolation, readJson } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const auth = await requireApiSection("products");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = buildProductData(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  try {
    const [slugTaken, skuTaken, category] = await Promise.all([
      prisma.product.findUnique({ where: { slug: data.slug }, select: { name: true } }),
      data.sku ? prisma.product.findUnique({ where: { sku: data.sku }, select: { name: true } }) : null,
      prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } }),
    ]);
    if (slugTaken) {
      return NextResponse.json(
        { error: `A product with slug "${data.slug}" already exists ("${slugTaken.name}").` },
        { status: 409 }
      );
    }
    if (skuTaken) {
      return NextResponse.json(
        { error: `A product with SKU "${data.sku}" already exists ("${skuTaken.name}").` },
        { status: 409 }
      );
    }
    if (!category) {
      return NextResponse.json({ error: "The selected category no longer exists." }, { status: 400 });
    }

    const product = await prisma.product.create({ data });
    refreshStorefront();
    await logAdminAction(auth.session, "create", "product", product.id, {
      name: product.name,
      status: product.status,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "Slug or SKU is already in use." }, { status: 409 });
    }
    console.error("Create product failed:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
