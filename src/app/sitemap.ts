import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/shop/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/shop/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Only include active, published/scheduled-due, and indexable products
  const products = await prisma.product.findMany({
    where: {
      AND: [
        { isActive: true },
        { robotsIndex: true },
        {
          OR: [
            { status: "published" },
            {
              status: "scheduled",
              scheduledAt: { lte: now },
            },
          ],
        },
      ],
    },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Only include published, scheduled-due, and indexable blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      AND: [
        {
          OR: [
            { status: "published" },
            { published: true, status: { not: "draft" } },
          ],
        },
        {
          robotsIndex: true,
        },
        {
          OR: [
            { scheduledAt: null },
            { scheduledAt: { lte: now } },
          ],
        },
      ],
    },
    select: { slug: true, updatedAt: true },
  });

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
