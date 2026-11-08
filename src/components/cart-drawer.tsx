"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/shipping";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const shipping = shippingFor(total);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setIsOpen]);

  const qtyButton =
    "flex h-9 w-9 items-center justify-center text-green-950 transition-colors hover:bg-green-100";

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-green-950/50 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-green-50 transition-transform duration-300 ease-out sm:w-[26rem]",
          isOpen ? "translate-x-0" : "invisible translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl text-green-950">
            Your cart <span className="font-sans text-sm text-gray-600">({items.length})</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full text-green-950 transition-colors hover:bg-green-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-green-700/40" strokeWidth={1.25} />
              <p className="font-display text-xl text-green-950">Your cart is empty</p>
              <p className="mb-5 mt-1 text-sm text-gray-600">Add something good for your hair.</p>
              <Link href="/shop/products" onClick={() => setIsOpen(false)} className="btn btn-primary">
                Shop products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4 first:pt-0">
                  <div className="surface relative h-20 w-20 shrink-0 overflow-hidden !rounded-xl">
                    <SmartImage src={item.image} alt="" fill sizes="80px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-0.5 text-sm font-semibold text-green-900">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-full border border-line bg-white">
                        <button
                          type="button"
                          className={qtyButton}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className={qtyButton}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-line bg-white px-5 py-4">
            {remaining > 0 && (
              <p className="text-xs text-green-800">Add {formatPrice(remaining)} more for free shipping</p>
            )}
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total + shipping)}</dd>
              </div>
            </dl>
            <Link
              href="/shop/checkout"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary w-full"
            >
              Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
