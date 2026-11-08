import { permanentRedirect } from "next/navigation";
import { findRedirect } from "@/lib/redirects";

/** Old /products/... links: follow the saved redirect, or try the current path. */
export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const redirect = await findRedirect(`/products/${slug}`);
  permanentRedirect(redirect?.targetPath ?? `/shop/products/${slug}`);
}
