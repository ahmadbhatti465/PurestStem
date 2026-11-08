import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { slugify } from "@/lib/slugify";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { recordBlogSlugRedirect } from "@/lib/redirects";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "blog_manager"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await checkAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await checkAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Slug validation and uniqueness
    const newSlug = slugify(body.slug || body.title || existingPost.slug);
    if (!newSlug) {
      return NextResponse.json({ error: "A valid slug is required" }, { status: 400 });
    }

    if (newSlug !== existingPost.slug) {
      const slugCollision = await prisma.blogPost.findUnique({
        where: { slug: newSlug },
      });
      if (slugCollision && slugCollision.id !== id) {
        return NextResponse.json(
          { error: `Slug "${newSlug}" is already in use by another article.` },
          { status: 400 }
        );
      }

      // If the post was already published, automatically record 301 redirect
      if (existingPost.status === "published" || existingPost.published) {
        await recordBlogSlugRedirect(existingPost.slug, newSlug);
      }
    }

    const status = body.status || (body.published === true || body.published === "true" ? "published" : "draft");
    const isPublished = status === "published";

    let publishedAt = existingPost.publishedAt;
    if (isPublished && !publishedAt) {
      publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    } else if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    }

    let scheduledAt: Date | null = null;
    if (status === "scheduled" && body.scheduledAt) {
      scheduledAt = new Date(body.scheduledAt);
    }

    const sanitizedContent = sanitizeHtml(body.content || "");

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: (body.title || existingPost.title).trim(),
        slug: newSlug,
        excerpt: body.excerpt !== undefined ? body.excerpt?.trim() || null : existingPost.excerpt,
        content: sanitizedContent,
        image: body.image !== undefined ? body.image || null : existingPost.image,
        imageAlt: body.imageAlt !== undefined ? body.imageAlt?.trim() || null : existingPost.imageAlt,
        imageCaption: body.imageCaption !== undefined ? body.imageCaption?.trim() || null : existingPost.imageCaption,
        imageCredit: body.imageCredit !== undefined ? body.imageCredit?.trim() || null : existingPost.imageCredit,
        imageWidth: body.imageWidth ? parseInt(body.imageWidth, 10) : existingPost.imageWidth,
        imageHeight: body.imageHeight ? parseInt(body.imageHeight, 10) : existingPost.imageHeight,
        author: (body.author || existingPost.author || "PurestStem").trim(),
        authorBio: body.authorBio !== undefined ? body.authorBio?.trim() || null : existingPost.authorBio,
        authorImage: body.authorImage !== undefined ? body.authorImage || null : existingPost.authorImage,
        categoryId: body.categoryId !== undefined ? body.categoryId || null : existingPost.categoryId,
        tags: body.tags !== undefined
          ? typeof body.tags === "string"
            ? body.tags
            : Array.isArray(body.tags)
            ? body.tags.join(", ")
            : null
          : existingPost.tags,
        status,
        published: isPublished,
        publishedAt,
        scheduledAt,
        seoTitle: body.seoTitle !== undefined ? body.seoTitle?.trim() || null : existingPost.seoTitle,
        seoDescription: body.seoDescription !== undefined ? body.seoDescription?.trim() || null : existingPost.seoDescription,
        focusKeyword: body.focusKeyword !== undefined ? body.focusKeyword?.trim() || null : existingPost.focusKeyword,
        secondaryKeywords: body.secondaryKeywords !== undefined
          ? typeof body.secondaryKeywords === "string"
            ? body.secondaryKeywords
            : Array.isArray(body.secondaryKeywords)
            ? body.secondaryKeywords.join(", ")
            : null
          : existingPost.secondaryKeywords,
        canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl?.trim() || null : existingPost.canonicalUrl,
        robotsIndex: body.robotsIndex !== undefined ? body.robotsIndex === true || body.robotsIndex === "true" : existingPost.robotsIndex,
        robotsFollow: body.robotsFollow !== undefined ? body.robotsFollow === true || body.robotsFollow === "true" : existingPost.robotsFollow,
        ogTitle: body.ogTitle !== undefined ? body.ogTitle?.trim() || null : existingPost.ogTitle,
        ogDescription: body.ogDescription !== undefined ? body.ogDescription?.trim() || null : existingPost.ogDescription,
        ogImage: body.ogImage !== undefined ? body.ogImage || null : existingPost.ogImage,
        twitterTitle: body.twitterTitle !== undefined ? body.twitterTitle?.trim() || null : existingPost.twitterTitle,
        twitterDescription: body.twitterDescription !== undefined ? body.twitterDescription?.trim() || null : existingPost.twitterDescription,
        twitterImage: body.twitterImage !== undefined ? body.twitterImage || null : existingPost.twitterImage,
        faqs: body.faqs !== undefined
          ? typeof body.faqs === "string"
            ? body.faqs
            : JSON.stringify(body.faqs)
          : existingPost.faqs,
        relatedProductIds: body.relatedProductIds !== undefined
          ? typeof body.relatedProductIds === "string"
            ? body.relatedProductIds
            : JSON.stringify(body.relatedProductIds)
          : existingPost.relatedProductIds,
      },
      include: {
        category: true,
      },
    });

    refreshStorefront();
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await checkAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    refreshStorefront();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
