import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import CartItems from "./cart-items";

export const metadata: Metadata = {
  title: "Shopping Cart | PurestStem Pakistan",
  description:
    "Review your herbal products in the PurestStem shopping cart. Checkout with cash on delivery across Pakistan.",
  robots: {
    index: false,
    follow: false,
  },
};

async function getRecommendations() {
  return await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

export default async function CartPage() {
  const recommendations = await getRecommendations();

  return (
    <Container className="py-8 pb-16">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <SectionHeader
        align="left"
        className="mt-4 mb-8"
        title="Shopping Cart"
        subtitle="Review your items and proceed to checkout for cash on delivery across Pakistan."
      />
      <CartItems recommendations={recommendations} />
    </Container>
  );
}
