import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductShowcase } from "@/components/home/product-showcase";
import type { ShowcaseProduct } from "@/lib/catalog";

export function Bestsellers({ products }: { products: ShowcaseProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section id="featured" className="bg-green-50 py-14 lg:py-20">
      <Container>
        <SectionHeader
          eyebrow="Shop the range"
          title="Find what your hair needs"
          subtitle="Pick a product to see it up close, then order in one step."
          action={
            <Link href="/shop/products" className="link-arrow">
              View all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <ProductShowcase products={products} />
      </Container>
    </section>
  );
}
