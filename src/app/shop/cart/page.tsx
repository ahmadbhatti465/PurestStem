import type { Metadata } from "next";
import { FadeIn } from "@/components/animations/fade-in";
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

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>
      </FadeIn>
      <CartItems />
    </div>
  );
}
