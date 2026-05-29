"use client";

import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string | null;
    category: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = calculateDiscount(product.price, product.salePrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/shop/products/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Eye className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs">No Image</span>
            </div>
          )}
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md"
            >
              -{discount}%
            </motion.div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.salePrice || product.price,
                  quantity: 1,
                  image: product.image || undefined,
                });
              }}
              className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Quick Add
            </button>
          </motion.div>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1.5">
          {product.category.name}
        </p>
        <Link href={`/shop/products/${product.slug}`}>
          <h3 className="font-semibold text-sm text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold text-green-700">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
