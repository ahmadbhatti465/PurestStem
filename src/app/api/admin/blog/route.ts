import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { buildBlogData } from "@/lib/blog-input";
import { requireApiSection, logAdminAction, isUniqueViolation, readJson } from "@/lib/admin-auth";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const auth = await requireApiSection("blog");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  try {
    const where: Prisma.BlogPostWhereInput = {};
    if (status && status !== "all") where.status = status;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { slug: { contains: q } },
        { focusKeyword: { contains: q } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireApiSection("blog");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = buildBlogData(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data } = parsed;

  try {
    const taken = await prisma.blogPost.findUnique({ where: { slug: data.slug }, select: { id: true } });
    if (taken) {
      return NextResponse.json(
        { error: `Slug "${data.slug}" is already in use by another article. Please use a unique slug.` },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({ data, include: { category: true } });
    refreshStorefront();
    await logAdminAction(auth.session, "create", "blogPost", post.id, { title: post.title, status: post.status });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "This slug is already in use." }, { status: 409 });
    }
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
