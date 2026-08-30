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
