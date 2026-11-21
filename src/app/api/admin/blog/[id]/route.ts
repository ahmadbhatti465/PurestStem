import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { buildBlogData } from "@/lib/blog-input";
import { recordBlogSlugRedirect } from "@/lib/redirects";
import { isPostLive } from "@/lib/visibility";
import {
  requireApiSection,
  logAdminAction,
  isUniqueViolation,
  isNotFound,
  readJson,
} from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("blog");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id }, include: { category: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("blog");
  if (!auth.ok) return auth.response;

  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  try {
    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (
      typeof body.expectedUpdatedAt === "string" &&
      new Date(body.expectedUpdatedAt).getTime() !== existing.updatedAt.getTime()
    ) {
      return NextResponse.json(
        {
          error:
            "This article was changed by someone else since you opened it. Reload the page to see their changes before saving.",
          conflict: true,
        },
        { status: 409 }
      );
    }

    const parsed = buildBlogData(body, existing);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { data } = parsed;

    if (data.slug !== existing.slug) {
      const collision = await prisma.blogPost.findUnique({ where: { slug: data.slug }, select: { id: true } });
      if (collision && collision.id !== id) {
        return NextResponse.json(
          { error: `Slug "${data.slug}" is already in use by another article.` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.blogPost.update({ where: { id }, data, include: { category: true } });

    // Record the redirect only after the new slug is saved, and only if the
    // old URL was ever public.
    if (updated.slug !== existing.slug && (isPostLive(existing) || existing.published)) {
      await recordBlogSlugRedirect(existing.slug, updated.slug);
    }

    refreshStorefront();
    await logAdminAction(auth.session, "update", "blogPost", id, {
      title: updated.title,
      ...(existing.status !== updated.status ? { statusFrom: existing.status, statusTo: updated.status } : {}),
      ...(existing.slug !== updated.slug ? { slugFrom: existing.slug, slugTo: updated.slug } : {}),
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "This slug is already in use." }, { status: 409 });
    }
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireApiSection("blog");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const post = await prisma.blogPost.delete({ where: { id }, select: { title: true } });
    refreshStorefront();
    await logAdminAction(auth.session, "delete", "blogPost", id, { title: post.title });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
