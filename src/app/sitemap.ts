import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";
import { liveProductWhere, livePostWhere } from "@/lib/visibility";

// Refresh periodically so new products and articles reach search engines without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/shop/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/shop/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/shop/shipping-returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Only include active, published/scheduled-due, and indexable products
  const products = await prisma.product.findMany({
    where: {
      AND: [liveProductWhere(now), { robotsIndex: true }],
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
      AND: [livePostWhere(now), { robotsIndex: true }],
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
