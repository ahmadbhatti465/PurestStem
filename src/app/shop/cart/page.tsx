import type { Metadata } from "next";
import { getBestsellers } from "@/lib/catalog";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnimatedText } from "@/components/motion/animated-text";
import CartItems from "./cart-items";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shopping Cart | PurestStem Pakistan",
  description:
    "Review your herbal products in the PurestStem shopping cart. Checkout with cash on delivery across Pakistan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage() {
  const recommendations = await getBestsellers(4);

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="heading-lg mb-8 mt-5 text-green-950"><AnimatedText text="Your cart" /></h1>
      <CartItems recommendations={recommendations} />
    </Container>
  );
}
