import { NextRequest, NextResponse } from "next/server";
import { requireApiSection } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  const auth = await requireApiSection("products");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const slug = slugify(searchParams.get("slug") || "");
  const excludeId = searchParams.get("excludeId");

  if (!slug) {
    return NextResponse.json({ available: false, error: "Slug is required" });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return NextResponse.json({ available: true, slug });
    }

    return NextResponse.json({
      available: false,
      slug,
      message: `A product with slug "${slug}" already exists ("${existing.name}").`,
    });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
}
