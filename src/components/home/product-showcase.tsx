"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Banknote, Check, MessageCircle, Plus, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { QuantityStepper } from "@/app/shop/products/[slug]/add-to-cart-button";
import { SmartImage } from "@/components/ui/smart-image";
import StarRating from "@/components/ui/star-rating";
import { calculateDiscount, cn, formatPrice, getPrimaryImage, slugify } from "@/lib/utils";
import type { ShowcaseProduct } from "@/lib/catalog";

const priceOf = (product: ShowcaseProduct) => product.salePrice || product.price;
const hasUnit = (size?: string | null) => Boolean(size && /[a-z]/i.test(size));

function toCartItem(product: ShowcaseProduct, quantity: number): CartItem {
  return {
    productId: product.id,
    name: product.name,
    slug: slugify(product.slug || product.name),
    price: priceOf(product),
    quantity,
    image: getPrimaryImage(product.image, product.images) || undefined,
  };
}

export function ProductShowcase({ products }: { products: ShowcaseProduct[] }) {
  const { items, addItem, updateQuantity, setIsOpen } = useCart();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const addedTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(addedTimer.current);
    },
    []
  );

  const selected = products.find((product) => product.id === selectedId) ?? products[0];
  const soldOut = selected.stock <= 0;
  const discount = calculateDiscount(selected.price, selected.salePrice);
  const inCart = items.find((item) => item.productId === selected.id);
  const whatsappUrl = `https://wa.me/923334117668?text=${encodeURIComponent(
    `Hello PurestStem, I want to order ${selected.name} (Qty ${quantity}) with Cash on Delivery`
  )}`;

  function select(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setQuantity(1);
    setAdded(false);
  }

  function handleAddToCart() {
    addItem(toCartItem(selected, quantity));
    setAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    // Buy now should mean "this many", not add more on top of what's in the cart.
    if (inCart) {
      updateQuantity(selected.id, quantity);
    } else {
      addItem(toCartItem(selected, quantity));
    }
    setIsOpen(false);
    router.push("/shop/checkout");
  }

  return (
    <div className="reveal mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
      {/* Every product at a glance */}
      <div className="order-2 min-w-0 md:order-1 md:col-span-2 lg:col-span-4">
        <ul
          aria-label="Choose a product"
          className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 py-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:h-full lg:flex-col lg:justify-between lg:overflow-visible lg:px-0 lg:py-0"
        >
          {products.map((product) => {
            const active = product.id === selected.id;
            const quantityInCart = items.find((item) => item.productId === product.id)?.quantity;
            return (
              <li key={product.id} className="relative w-[9.5rem] shrink-0 snap-start lg:w-full">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(product.id)}
                  onMouseEnter={() => {
                    window.clearTimeout(hoverTimer.current);
                    hoverTimer.current = window.setTimeout(() => select(product.id), 110);
                  }}
                  onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
                  className={cn(
                    "flex h-full w-full flex-col gap-2 rounded-2xl border bg-white p-2.5 text-left transition-colors duration-200 lg:flex-row lg:items-center lg:gap-3 lg:pr-14",
                    active ? "border-green-900 ring-1 ring-green-900" : "border-line hover:border-green-500"
                  )}
                >
                  <span className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-white lg:h-16 lg:w-16">
                    <SmartImage
                      src={getPrimaryImage(product.image, product.images)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 64px, 128px"
                      className="scale-125 object-contain p-1 brightness-[1.04]"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">{product.name}</span>
                    <span className="mt-1 block text-sm font-semibold text-green-900">{formatPrice(priceOf(product))}</span>
                    {quantityInCart ? (
                      <span className="mt-0.5 block text-xs text-green-800">{quantityInCart} in cart</span>
                    ) : null}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => addItem(toCartItem(product, 1))}
                  aria-label={`Quick add ${product.name} to cart`}
                  className="absolute right-2.5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-100 text-green-900 transition-colors hover:bg-green-900 hover:text-white disabled:opacity-40 lg:flex"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Large preview. All images stay mounted so switching is instant. */}
      <div className="surface relative order-1 aspect-square overflow-hidden !rounded-3xl md:order-2 md:aspect-auto md:min-h-[27rem] lg:col-span-4">
        <div className="arch absolute inset-x-[12%] bottom-0 top-[9%] !rounded-b-none border border-b-0 border-green-300/70 bg-green-100/30" aria-hidden="true" />
        {products.map((product) => {
          const active = product.id === selected.id;
          return (
            <SmartImage
              key={product.id}
              src={getPrimaryImage(product.image, product.images)}
              alt={active ? product.name : ""}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className={cn(
                "bottle-float object-contain p-5 mix-blend-multiply brightness-[1.04] transition-[opacity,scale] duration-500",
                active ? "scale-100 opacity-100" : "scale-90 opacity-0"
              )}
            />
          );
        })}
        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-green-900 px-3 py-1.5 text-xs font-semibold text-white">
            Save {discount}%
          </span>
        )}
      </div>

      {/* Everything needed to order */}
      <div className="surface order-3 flex flex-col !rounded-3xl p-5 sm:p-6 lg:col-span-4">
        <p className="text-sm font-medium text-green-800">{selected.category.name}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-green-950 sm:text-3xl" aria-live="polite">
          {selected.name}
        </h3>

        {selected.reviewCount > 0 && selected.rating !== null && (
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <StarRating rating={selected.rating} size="sm" />
            {selected.rating.toFixed(1)} ({selected.reviewCount})
          </p>
        )}

        {selected.shortDescription && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{selected.shortDescription}</p>
        )}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className="text-3xl font-semibold text-green-950">{formatPrice(priceOf(selected) * quantity)}</span>
          {discount > 0 && (
            <span className="text-base text-gray-500 line-through">{formatPrice(selected.price * quantity)}</span>
          )}
          {hasUnit(selected.weight) && <span className="text-sm text-gray-600">{selected.weight}</span>}
        </div>
        {!soldOut && selected.stock <= 5 && (
          <p className="mt-1 text-sm font-medium text-green-800">Only {selected.stock} left</p>
        )}

        <div className="mt-auto space-y-2.5 pt-5">
          <div className="flex gap-2.5">
            <QuantityStepper
              quantity={quantity}
              increase={() => setQuantity((q) => Math.min(q + 1, selected.stock))}
              decrease={() => setQuantity((q) => Math.max(q - 1, 1))}
              stock={selected.stock}
            />
            <button type="button" onClick={handleAddToCart} disabled={soldOut} className="btn btn-outline flex-1 !px-3">
              {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
              {added ? "Added" : "Add to cart"}
            </button>
          </div>

          <button type="button" onClick={handleBuyNow} disabled={soldOut} className="btn btn-primary w-full !min-h-14 !text-base">
            {soldOut ? (
              "Sold out"
            ) : (
              <>
                Buy now, pay on delivery <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between gap-3 text-sm font-medium text-green-900">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-1.5 underline-offset-4 hover:underline">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Order on WhatsApp
            </a>
            <Link href={`/shop/products/${encodeURIComponent(slugify(selected.slug || selected.name))}`} className="flex min-h-11 items-center underline-offset-4 hover:underline">
              Full details
            </Link>
          </div>
        </div>

        <ul className="mt-2 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs text-gray-600">
          <li className="flex items-center gap-1.5"><Banknote className="h-4 w-4 shrink-0 text-green-800" strokeWidth={1.5} aria-hidden="true" /> Pay on delivery</li>
          <li className="flex items-center gap-1.5"><Truck className="h-4 w-4 shrink-0 text-green-800" strokeWidth={1.5} aria-hidden="true" /> 2–4 working days</li>
          <li className="flex items-center gap-1.5"><RotateCcw className="h-4 w-4 shrink-0 text-green-800" strokeWidth={1.5} aria-hidden="true" /> 7-day replacement</li>
        </ul>
      </div>
    </div>
  );
}
