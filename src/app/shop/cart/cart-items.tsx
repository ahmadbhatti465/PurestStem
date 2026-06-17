"use client";

import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, ArrowRight, Truck, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export default function CartItems() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const shippingCost = total >= 5000 ? 0 : 190;
  const finalTotal = total + shippingCost;
  const progressPercent = Math.min((total / 5000) * 100, 100);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-20">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. Explore our herbal collection!
        </p>
        <Link
          href="/shop/products"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3.5 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
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
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-100 transition-colors rounded-l-xl"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-green-100 transition-colors rounded-r-xl"
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

          {total < 5000 && (
            <div className="mb-5 p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  Add {formatPrice(5000 - total)} more for free shipping!
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

          <div className="border-t pt-4 mb-5">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="mb-5 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
              <p className="text-xs text-gray-500">Pay when you receive your order</p>
            </div>
          </div>

          <Link
            href="/shop/checkout"
            className="block w-full bg-green-700 text-white text-center py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 hover:shadow-xl hover:scale-[1.02]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
