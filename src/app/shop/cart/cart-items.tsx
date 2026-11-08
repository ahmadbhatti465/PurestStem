"use client";

import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/shipping";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import ProductCard from "@/components/product-card";

interface CartItemsProps {
  recommendations: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string | null;
    images?: string | null;
    stock?: number;
    category: { name: string };
  }[];
}

export default function CartItems({ recommendations }: CartItemsProps) {
  const { items, removeItem, updateQuantity, total, isReady } = useCart();
  const shippingCost = shippingFor(total);
  const progressPercent = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  const recommendationSection = recommendations.length > 0 && (
    <section className="mt-16 border-t border-line pt-12">
      <h2 className="font-display text-3xl text-green-950">You might also like</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  if (!isReady) {
    return <div className="surface h-48 animate-pulse !bg-green-100/50" aria-label="Loading your cart" />;
  }

  if (items.length === 0) {
    return (
      <>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Explore our herbal collection and find what your hair needs."
          action={
            <Link href="/shop/products" className="btn btn-primary">
              Start shopping <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        {recommendationSection}
      </>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <ul className="divide-y divide-line border-y border-line lg:col-span-2">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5">
              <div className="surface relative h-24 w-24 shrink-0 overflow-hidden sm:h-28 sm:w-28">
                <SmartImage src={item.image} alt="" fill sizes="112px" className="object-contain p-1.5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {item.slug ? (
                      <Link href={`/shop/products/${item.slug}`} className="font-display text-lg leading-snug text-green-950 hover:text-green-800">
                        {item.name}
                      </Link>
                    ) : (
                      <p className="font-display text-lg leading-snug text-green-950">{item.name}</p>
                    )}
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-full border border-line bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-green-100"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-green-100"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-green-950">Order summary</h2>

          {remainingForFree > 0 && (
            <div className="mt-4">
              <p className="text-sm text-green-800">Add {formatPrice(remainingForFree)} more for free shipping</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-green-100">
                <div className="h-full rounded-full bg-green-800" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-medium">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold text-gray-900">
              <dt>Total</dt>
              <dd>{formatPrice(total + shippingCost)}</dd>
            </div>
          </dl>

          <Link href="/shop/checkout" className="btn btn-primary mt-5 w-full">
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-gray-600">Pay cash when your order arrives</p>
        </aside>
      </div>

      {recommendationSection}
    </>
  );
}
