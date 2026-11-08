import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  BLOG_TAG,
  CATALOG_TAG,
  STOREFRONT_REVALIDATE_SECONDS,
} from "@/lib/storefront-cache";

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  salePrice: true,
  image: true,
  images: true,
  stock: true,
  weight: true,
  featured: true,
  createdAt: true,
  category: { select: { name: true, slug: true } },
} as const;

/** Cached list of every active product, shared by the shop page filters. */
export const getActiveProducts = unstable_cache(
  () =>
    prisma.product.findMany({
      where: { isActive: true },
      select: { ...cardSelect, description: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
  ["active-products"],
  { revalidate: STOREFRONT_REVALIDATE_SECONDS, tags: [CATALOG_TAG] }
);

/** Categories that have at least one active product to show. */
export const getShopCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: "asc" },
    });
    return categories.filter((category) => category._count.products > 0);
  },
  ["shop-categories"],
  { revalidate: STOREFRONT_REVALIDATE_SECONDS, tags: [CATALOG_TAG] }
);

export const getBestsellers = cache((take: number) =>
  prisma.product.findMany({
    where: { isActive: true },
    select: cardSelect,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
  })
);

/** Homepage shop panel: card data plus a summary and each product's real rating. */
export async function getShowcaseProducts(take: number) {
  const [products, ratings] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { ...cardSelect, shortDescription: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take,
    }),
    prisma.review.groupBy({ by: ["productId"], _avg: { rating: true }, _count: true }),
  ]);
  const ratingByProduct = new Map(ratings.map((rating) => [rating.productId, rating]));

  return products.map((product) => ({
    ...product,
    rating: ratingByProduct.get(product.id)?._avg.rating ?? null,
    reviewCount: ratingByProduct.get(product.id)?._count ?? 0,
  }));
}

export type ShowcaseProduct = Awaited<ReturnType<typeof getShowcaseProducts>>[number];

const productDetailInclude = {
  category: true,
  reviews: { orderBy: { createdAt: "desc" as const } },
};

/**
 * Finds a product by its exact slug. Falls back to comparing normalised slugs
 * so older links with different punctuation keep working, without loading the
 * full catalog for the common case. Cached per request because metadata and
 * the page both need it.
 */
export const getProductBySlug = cache(async (slug: string) => {
  const direct = await prisma.product.findUnique({
    where: { slug },
    include: productDetailInclude,
  });
  if (direct) return direct;

  const normalized = slugify(slug);
  const slugs = await prisma.product.findMany({ select: { id: true, slug: true } });
  const match = slugs.find((product) => slugify(product.slug) === normalized);
  if (!match) return null;

  return prisma.product.findUnique({
    where: { id: match.id },
    include: productDetailInclude,
  });
});

export const getPublishedPosts = unstable_cache(
  () =>
    prisma.blogPost.findMany({
      where: {
        AND: [
          { OR: [{ status: "published" }, { published: true, status: { not: "draft" } }] },
          { OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }] },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        seoDescription: true,
        image: true,
        imageAlt: true,
        author: true,
        content: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
      },
    }),
  ["published-posts"],
  { revalidate: STOREFRONT_REVALIDATE_SECONDS, tags: [BLOG_TAG] }
);

export const getBlogCategories = unstable_cache(
  () =>
    prisma.category.findMany({
      where: { blogPosts: { some: { status: "published" } } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ["blog-categories"],
  { revalidate: STOREFRONT_REVALIDATE_SECONDS, tags: [BLOG_TAG] }
);
