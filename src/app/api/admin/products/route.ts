import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        stock: parseInt(body.stock),
        sku: body.sku || null,
        weight: body.weight || null,
        ingredients: body.ingredients || null,
        howToUse: body.howToUse || null,
        featured: body.featured === "true" || body.featured === true,
        isActive: body.isActive === "true" || body.isActive === true || body.isActive === undefined,
        categoryId: body.categoryId,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
