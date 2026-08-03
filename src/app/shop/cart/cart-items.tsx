"use client";

import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, ArrowRight, Truck, Gift, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import ProductCard from "@/components/product-card";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

interface CartItemsProps {
  recommendations: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string | null;
    images?: string | null;
    category: { name: string };
  }[];
}

export default function CartItems({ recommendations }: CartItemsProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const shippingCost = total >= 5000 ? 0 : 190;
  const finalTotal = total + shippingCost;
  const progressPercent = Math.min((total / 5000) * 100, 100);
  const remainingForFree = Math.max(0, 5000 - total);

  if (items.length === 0) {
    return (
      <div className="space-y-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Explore our herbal collection!"
          action={
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3.5 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        {recommendations.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">You Might Also Like</h2>
            </div>
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <Link
                          href={`/shop/products/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-green-700 transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 min-w-[44px] min-h-[44px] text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-green-100 transition-colors rounded-l-xl"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-green-100 transition-colors rounded-r-xl"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="ml-auto font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-5 text-gray-900">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            {remainingForFree > 0 && (
              <div className="mb-5 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">
                    Add {formatPrice(remainingForFree)} more for free shipping!
                  </p>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/*  Total  */}
            <div className="border-t pt-4 mb-5">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="mb-5 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when you receive your order</p>
              </div>
            </div>

            <Link
              href="/shop/checkout"
              className="block w-full min-h-[48px] bg-green-700 text-white text-center py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 hover:shadow-xl hover:scale-[1.02]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      </div>

      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-green-600" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">You Might Also Like</h2>
          </div>
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}
    </div>
  );
}
