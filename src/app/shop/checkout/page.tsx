"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { shippingFor } from "@/lib/shipping";
import { trackInitiateCheckout, trackPurchase } from "@/lib/meta/pixel";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import { CheckoutSteps } from "@/components/checkout-steps";
import { AnimatedText } from "@/components/motion/animated-text";

const initialForm = { name: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: "" };
type FormField = keyof typeof initialForm;

export default function CheckoutPage() {
  const { items, total, clearCart, isReady } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const initiateTracked = useRef(false);

  const shippingCost = shippingFor(total);
  const finalTotal = total + shippingCost;

  useEffect(() => {
    if (items.length > 0 && !initiateTracked.current) {
      initiateTracked.current = true;
      trackInitiateCheckout(items, total);
    }
  }, [items, total]);

  const bind = (field: FormField) => ({
    id: `checkout-${field}`,
    name: field,
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: e.target.value })),
    className: "field",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error || "We couldn't place your order. Please try again.");
        setLoading(false);
        return;
      }

      const order = await response.json();
      try {
        trackPurchase(order, `purchase_${order.id}`);
        sessionStorage.setItem(`meta_purchase_tracked_${order.id}`, "true");
      } catch (trackError) {
        console.warn("[Meta Purchase Track Error]", trackError);
      }

      // Keeps the empty-cart screen from flashing before the redirect lands.
      setPlaced(true);
      clearCart();
      router.push(`/shop/checkout/success?orderId=${order.id}`);
    } catch {
      setError("Connection problem. Please check your internet and try again.");
      setLoading(false);
    }
  }

  if (!isReady || placed) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-green-800" aria-label="Loading" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some herbal products before checking out."
          action={
            <Link href="/shop/products" className="btn btn-primary">
              Continue shopping <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <CheckoutSteps currentStep={2} />
      <h1 className="heading-lg mt-6 text-green-950"><AnimatedText text="Checkout" /></h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <form onSubmit={handleSubmit} className="enter space-y-8 lg:col-span-7">
          <fieldset className="space-y-4">
            <legend className="mb-4 font-display text-2xl text-green-950">Your details</legend>
            <div>
              <label htmlFor="checkout-name" className="field-label">Full name</label>
              <input {...bind("name")} type="text" required minLength={2} autoComplete="name" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-phone" className="field-label">Phone</label>
                <input {...bind("phone")} type="tel" required minLength={7} autoComplete="tel" inputMode="tel" placeholder="03XX XXXXXXX" />
              </div>
              <div>
                <label htmlFor="checkout-email" className="field-label">Email</label>
                <input {...bind("email")} type="email" required autoComplete="email" />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 font-display text-2xl text-green-950">Delivery address</legend>
            <div>
              <label htmlFor="checkout-address" className="field-label">Address</label>
              <input {...bind("address")} type="text" required minLength={5} autoComplete="street-address" placeholder="House, street, area" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-city" className="field-label">City</label>
                <input {...bind("city")} type="text" required minLength={2} autoComplete="address-level2" />
              </div>
              <div>
                <label htmlFor="checkout-postalCode" className="field-label">Postal code (optional)</label>
                <input {...bind("postalCode")} type="text" autoComplete="postal-code" inputMode="numeric" />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-notes" className="field-label">Order notes (optional)</label>
              <textarea {...bind("notes")} rows={3} className="field resize-none" placeholder="Special delivery instructions" />
            </div>
          </fieldset>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full !min-h-14 !text-base">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? "Placing your order" : `Place order · ${formatPrice(finalTotal)}`}
          </button>
          <p className="text-center text-sm text-gray-600">
            You pay in cash when your order arrives. We&apos;ll call to confirm within 24 hours.
          </p>
        </form>

        <aside className="surface enter h-fit p-6 lg:sticky lg:top-28 lg:col-span-5">
          <h2 className="font-display text-2xl text-green-950">Order summary</h2>
          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                  <SmartImage src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold text-gray-900">
              <dt>Total</dt>
              <dd>{formatPrice(finalTotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
