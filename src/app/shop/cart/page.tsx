import { FadeIn } from "@/components/animations/fade-in";
import CartItems from "./cart-items";

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
