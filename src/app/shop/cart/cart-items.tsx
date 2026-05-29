"use client";

import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export default function CartItems() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const shippingCost = total >= 5000 ? 0 : 190;
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you have not added anything to your cart yet.</p>
        <Link
          href="/shop/products"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
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
                className="flex gap-4 bg-gray-50 p-4 rounded-xl"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
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
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
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
        <div className="bg-gray-50 p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={shippingCost === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
            {total < 5000 && (
              <p className="text-sm text-green-600">
                Add {formatPrice(5000 - total)} more for free shipping!
              </p>
            )}
          </div>
          <div className="border-t pt-3 mb-6">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <Link
            href="/shop/checkout"
            className="block w-full bg-green-700 text-white text-center py-3 rounded-md font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
          >
            Proceed to Checkout
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
