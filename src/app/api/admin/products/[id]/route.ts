import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { refreshStorefront } from "@/lib/storefront-cache";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { slugify } from "@/lib/slugify";
import { recordProductSlugRedirect } from "@/lib/redirects";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "product_manager"].includes(session.user.role)) {
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await checkAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Product Name is required." }, { status: 400 });
    }

    const slug = slugify(body.slug || name);
    if (!slug) {
      return NextResponse.json({ error: "URL Slug is required." }, { status: 400 });
    }

    const price = parseFloat(body.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Valid non-negative price is required." }, { status: 400 });
    }

    let salePrice: number | null = null;
    if (body.salePrice !== undefined && body.salePrice !== null && body.salePrice !== "") {
      salePrice = parseFloat(body.salePrice);
      if (isNaN(salePrice) || salePrice < 0) {
        return NextResponse.json({ error: "Sale price must be a valid non-negative number." }, { status: 400 });
      }
      if (salePrice >= price) {
        return NextResponse.json(
          { error: `Sale price (Rs. ${salePrice}) must be less than regular price (Rs. ${price}).` },
          { status: 400 }
        );
      }
    }

    const stock = parseInt(body.stock ?? "0", 10);
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: "Valid stock quantity is required." }, { status: 400 });
    }

    // Check slug uniqueness
    if (slug !== existing.slug) {
      const duplicateSlug = await prisma.product.findUnique({
        where: { slug },
        select: { id: true, name: true },
      });
      if (duplicateSlug && duplicateSlug.id !== id) {
        return NextResponse.json(
          { error: `A product with slug "${slug}" already exists ("${duplicateSlug.name}").` },
          { status: 409 }
        );
      }

      // Record 301 slug redirect
      await recordProductSlugRedirect(existing.slug, slug);
    }

    // Check SKU uniqueness
    const sku = body.sku ? body.sku.trim() : null;
    if (sku && sku !== existing.sku) {
      const duplicateSku = await prisma.product.findUnique({
        where: { sku },
        select: { id: true, name: true },
      });
      if (duplicateSku && duplicateSku.id !== id) {
        return NextResponse.json(
          { error: `A product with SKU "${sku}" already exists ("${duplicateSku.name}").` },
          { status: 409 }
        );
      }
    }

    // Process images
    let imageMetadataStr: string | null = null;
    let primaryImageUrl: string | null = body.image || null;
    let imageUrlsList: string[] = [];

    if (body.imageMetadata) {
      const str = typeof body.imageMetadata === "string" ? body.imageMetadata : JSON.stringify(body.imageMetadata);
      imageMetadataStr = str;
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrlsList = parsed.map((item) => (typeof item === "string" ? item : item.url)).filter(Boolean);
          if (!primaryImageUrl && imageUrlsList.length > 0) {
            primaryImageUrl = imageUrlsList[0];
          }
        }
      } catch {
        // ignore
      }
    } else if (body.images) {
      const imagesStr = typeof body.images === "string" ? body.images : JSON.stringify(body.images);
      try {
        const parsed = JSON.parse(imagesStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrlsList = parsed;
          if (!primaryImageUrl) primaryImageUrl = parsed[0];
        }
      } catch {
        // ignore
      }
    }

    const imagesJsonStr = imageUrlsList.length > 0 ? JSON.stringify(imageUrlsList) : null;

    const structuredIngredientsStr = body.structuredIngredients
      ? typeof body.structuredIngredients === "string"
        ? body.structuredIngredients
        : JSON.stringify(body.structuredIngredients)
      : null;

    const structuredHowToUseStr = body.structuredHowToUse
      ? typeof body.structuredHowToUse === "string"
        ? body.structuredHowToUse
        : JSON.stringify(body.structuredHowToUse)
      : null;

    const benefitsStr = body.benefits
      ? typeof body.benefits === "string"
        ? body.benefits
      : JSON.stringify(body.benefits)
      : null;

    const featuresStr = body.features
      ? typeof body.features === "string"
        ? body.features
      : JSON.stringify(body.features)
      : null;

    const faqsStr = body.faqs
      ? typeof body.faqs === "string"
        ? body.faqs
      : JSON.stringify(body.faqs)
      : null;

    const relatedProductIdsStr = body.relatedProductIds
      ? typeof body.relatedProductIds === "string"
        ? body.relatedProductIds
      : JSON.stringify(body.relatedProductIds)
      : null;

    const relatedBlogIdsStr = body.relatedBlogIds
      ? typeof body.relatedBlogIds === "string"
        ? body.relatedBlogIds
      : JSON.stringify(body.relatedBlogIds)
      : null;

    const secondaryKeywordsStr = body.secondaryKeywords
      ? Array.isArray(body.secondaryKeywords)
        ? body.secondaryKeywords.join(", ")
        : String(body.secondaryKeywords)
      : null;

    const status = body.status || existing.status || "published";
    const publishedAt =
      status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt;
    const scheduledAt =
      status === "scheduled" && body.scheduledAt ? new Date(body.scheduledAt) : null;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: body.description ? sanitizeHtml(body.description) : null,
        shortDescription: body.shortDescription ? body.shortDescription.trim() : null,
        brand: body.brand ? body.brand.trim() : "PurestStem",
        productType: body.productType ? body.productType.trim() : null,
        condition: body.condition ? body.condition.trim() : "New",
        gtin: body.gtin ? body.gtin.trim() : null,
        mpn: body.mpn ? body.mpn.trim() : null,
        unit: body.unit ? body.unit.trim() : "piece",
        price,
        salePrice,
        stock,
        sku,
        weight: body.weight ? body.weight.trim() : null,
        weightValue: body.weightValue ? parseFloat(body.weightValue) : null,
        weightUnit: body.weightUnit ? body.weightUnit.trim() : "ml",
        ingredients: body.ingredients ? body.ingredients.trim() : null,
        structuredIngredients: structuredIngredientsStr,
        howToUse: body.howToUse ? body.howToUse.trim() : null,
        structuredHowToUse: structuredHowToUseStr,
        benefits: benefitsStr,
        features: featuresStr,
        image: primaryImageUrl,
        images: imagesJsonStr,
        imageMetadata: imageMetadataStr,
        featured: body.featured === "true" || body.featured === true,
        isActive: body.isActive === "false" || body.isActive === false ? false : status !== "draft",
        status,
        publishedAt,
        scheduledAt,
        seoTitle: body.seoTitle ? body.seoTitle.trim() : null,
        seoDescription: body.seoDescription ? body.seoDescription.trim() : null,
        focusKeyword: body.focusKeyword ? body.focusKeyword.trim() : null,
        secondaryKeywords: secondaryKeywordsStr,
        canonicalUrl: body.canonicalUrl ? body.canonicalUrl.trim() : null,
        robotsIndex: body.robotsIndex !== false && body.robotsIndex !== "false",
        robotsFollow: body.robotsFollow !== false && body.robotsFollow !== "false",
        ogTitle: body.ogTitle ? body.ogTitle.trim() : null,
        ogDescription: body.ogDescription ? body.ogDescription.trim() : null,
        ogImage: body.ogImage || null,
        twitterTitle: body.twitterTitle ? body.twitterTitle.trim() : null,
        twitterDescription: body.twitterDescription ? body.twitterDescription.trim() : null,
        twitterImage: body.twitterImage || null,
        faqs: faqsStr,
        relatedProductIds: relatedProductIdsStr,
        relatedBlogIds: relatedBlogIdsStr,
        categoryId: body.categoryId || existing.categoryId,
      },
    });

    refreshStorefront();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product failed:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
    await prisma.product.delete({ where: { id } });
    refreshStorefront();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Foreign key constraint")) {
      return NextResponse.json(
        { error: "Cannot delete product because it is linked to existing customer orders." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
