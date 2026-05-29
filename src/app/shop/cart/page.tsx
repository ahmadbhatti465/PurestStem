import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartItems from "./cart-items";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <CartItems />
    </div>
  );
}
