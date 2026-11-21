import { NextRequest, NextResponse } from "next/server";
import { requireApiSection } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await requireApiSection("linkSearch");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  try {
    // 1. Fetch Products
    const products = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { slug: { contains: q } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
        category: { select: { name: true } },
      },
      take: 10,
    });

    // 2. Fetch Blog Posts
    const blogPosts = await prisma.blogPost.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q } },
              { slug: { contains: q } },
            ],
          }
        : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        status: true,
      },
      take: 10,
    });

    // 3. Fetch Categories
    const categories = await prisma.category.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { slug: { contains: q } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10,
    });

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        title: p.name,
        url: `/shop/products/${p.slug}`,
        type: "product",
        subtitle: `Rs. ${p.price.toLocaleString()}${p.category ? ` • ${p.category.name}` : ""}`,
        image: p.image,
      })),
      blogPosts: blogPosts.map((b) => ({
        id: b.id,
        title: b.title,
        url: `/blog/${b.slug}`,
        type: "blog",
        subtitle: `Status: ${b.status}`,
        image: b.image,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        title: c.name,
        url: `/shop/products?category=${c.slug}`,
        type: "category",
        subtitle: `Category page`,
      })),
    });
  } catch (error) {
    console.error("Error searching links:", error);
    return NextResponse.json({ error: "Failed to search links" }, { status: 500 });
  }
}
