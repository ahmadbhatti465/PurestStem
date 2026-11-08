import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";

const reviewSchema = z.object({
  productId: z.string().min(1).max(64),
  name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(2000),
});

export async function POST(request: NextRequest) {
  let input: z.infer<typeof reviewSchema>;
  try {
    input = reviewSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Please check your review and try again." }, { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id: input.productId, isActive: true },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await prisma.review.create({ data: input });
    refreshStorefront();

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
