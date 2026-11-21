import { prisma } from "./db";

/**
 * Record a 301 redirect when a published blog post changes its slug.
 */
export async function recordBlogSlugRedirect(oldSlug: string, newSlug: string) {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;

  const sourcePath = `/blog/${oldSlug}`;
  const targetPath = `/blog/${newSlug}`;

  try {
    // 1. Upsert the direct redirect
    await prisma.redirect.upsert({
      where: { sourcePath },
      update: { targetPath, statusCode: 301 },
      create: { sourcePath, targetPath, statusCode: 301 },
    });

    // 2. Also handle legacy /shop/blog/ path
    const legacySource = `/shop/blog/${oldSlug}`;
    await prisma.redirect.upsert({
      where: { sourcePath: legacySource },
      update: { targetPath, statusCode: 301 },
      create: { sourcePath: legacySource, targetPath, statusCode: 301 },
    });

    // 3. Update any existing redirects that pointed to the old path to avoid redirect chains
    await prisma.redirect.updateMany({
      where: { targetPath: sourcePath },
      data: { targetPath },
    });
  } catch (error) {
    console.error("Failed to record blog slug redirect:", error);
  }
}

/**
 * Record a 301 redirect when a published product changes its slug.
 */
export async function recordProductSlugRedirect(oldSlug: string, newSlug: string) {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;

  const sourcePath = `/shop/products/${oldSlug}`;
  const targetPath = `/shop/products/${newSlug}`;

  try {
    // 1. Upsert the direct redirect
    await prisma.redirect.upsert({
      where: { sourcePath },
      update: { targetPath, statusCode: 301 },
      create: { sourcePath, targetPath, statusCode: 301 },
    });

    // 2. Also handle legacy /products/ path
    const legacySource = `/products/${oldSlug}`;
    await prisma.redirect.upsert({
      where: { sourcePath: legacySource },
      update: { targetPath, statusCode: 301 },
      create: { sourcePath: legacySource, targetPath, statusCode: 301 },
    });

    // 3. Update any existing redirects that pointed to the old path to avoid redirect chains
    await prisma.redirect.updateMany({
      where: { targetPath: sourcePath },
      data: { targetPath },
    });
    await prisma.redirect.updateMany({
      where: { targetPath: legacySource },
      data: { targetPath },
    });
  } catch (error) {
    console.error("Failed to record product slug redirect:", error);
  }
}

/**
 * Look up a 301 redirect for a given path.
 */
export async function findRedirect(path: string) {
  try {
    return await prisma.redirect.findUnique({
      where: { sourcePath: path },
    });
  } catch {
    return null;
  }
}

/** Category pages are a query string on the shop page, so the key includes it. */
export function categoryRedirectPath(slug: string) {
  return `/shop/products?category=${slug}`;
}

/**
 * Record a 301 redirect when a category's slug changes, so old filtered shop
 * links (and search results) keep working.
 */
export async function recordCategorySlugRedirect(oldSlug: string, newSlug: string) {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  const sourcePath = categoryRedirectPath(oldSlug);
  const targetPath = categoryRedirectPath(newSlug);
  try {
    await prisma.redirect.upsert({
      where: { sourcePath },
      update: { targetPath, statusCode: 301 },
      create: { sourcePath, targetPath, statusCode: 301 },
    });
    // Collapse chains (a -> b, then b -> c becomes a -> c).
    await prisma.redirect.updateMany({ where: { targetPath: sourcePath }, data: { targetPath } });
    // If the new slug was itself redirected away before, that redirect is now wrong.
    await prisma.redirect.deleteMany({ where: { sourcePath: targetPath } });
  } catch (error) {
    console.error("Failed to record category slug redirect:", error);
  }
}
