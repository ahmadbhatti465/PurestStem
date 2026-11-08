import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { slugify } from "@/lib/slugify";
import { sanitizeHtml } from "@/lib/html-sanitizer";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "blog_manager"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await checkAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  try {
    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { slug: { contains: q } },
        { focusKeyword: { contains: q } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await checkAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();

    // Required fields validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Slug validation and uniqueness
    const generatedSlug = slugify(body.slug || body.title);
    if (!generatedSlug) {
      return NextResponse.json({ error: "A valid slug is required" }, { status: 400 });
    }

    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Slug "${generatedSlug}" is already in use by another article. Please use a unique slug.` },
        { status: 400 }
      );
    }

    const status = body.status || (body.published === true || body.published === "true" ? "published" : "draft");
    const isPublished = status === "published";

    let publishedAt: Date | null = null;
    if (isPublished) {
      publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    }

    let scheduledAt: Date | null = null;
    if (status === "scheduled" && body.scheduledAt) {
      scheduledAt = new Date(body.scheduledAt);
    }

    const sanitizedContent = sanitizeHtml(body.content || "");

    const post = await prisma.blogPost.create({
      data: {
        title: body.title.trim(),
        slug: generatedSlug,
        excerpt: body.excerpt?.trim() || null,
        content: sanitizedContent,
        image: body.image || null,
        imageAlt: body.imageAlt?.trim() || null,
        imageCaption: body.imageCaption?.trim() || null,
        imageCredit: body.imageCredit?.trim() || null,
        imageWidth: body.imageWidth ? parseInt(body.imageWidth, 10) : null,
        imageHeight: body.imageHeight ? parseInt(body.imageHeight, 10) : null,
        author: body.author?.trim() || "PurestStem",
        authorBio: body.authorBio?.trim() || null,
        authorImage: body.authorImage || null,
        categoryId: body.categoryId || null,
        tags: typeof body.tags === "string" ? body.tags : Array.isArray(body.tags) ? body.tags.join(", ") : null,
        status,
        published: isPublished,
        publishedAt,
        scheduledAt,
        seoTitle: body.seoTitle?.trim() || null,
        seoDescription: body.seoDescription?.trim() || null,
        focusKeyword: body.focusKeyword?.trim() || null,
        secondaryKeywords: typeof body.secondaryKeywords === "string"
          ? body.secondaryKeywords
          : Array.isArray(body.secondaryKeywords)
          ? body.secondaryKeywords.join(", ")
          : null,
        canonicalUrl: body.canonicalUrl?.trim() || null,
        robotsIndex: body.robotsIndex !== false && body.robotsIndex !== "false",
        robotsFollow: body.robotsFollow !== false && body.robotsFollow !== "false",
        ogTitle: body.ogTitle?.trim() || null,
        ogDescription: body.ogDescription?.trim() || null,
        ogImage: body.ogImage || null,
        twitterTitle: body.twitterTitle?.trim() || null,
        twitterDescription: body.twitterDescription?.trim() || null,
        twitterImage: body.twitterImage || null,
        faqs: body.faqs ? (typeof body.faqs === "string" ? body.faqs : JSON.stringify(body.faqs)) : null,
        relatedProductIds: body.relatedProductIds
          ? typeof body.relatedProductIds === "string"
            ? body.relatedProductIds
            : JSON.stringify(body.relatedProductIds)
          : null,
      },
      include: {
        category: true,
      },
    });

    refreshStorefront();
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
