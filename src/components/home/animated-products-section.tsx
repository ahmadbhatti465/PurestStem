"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Package, Check, Sparkles, ArrowRight, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  images?: string | null;
  weight?: string | null;
  category: {
    id?: string;
    name: string;
    slug?: string;
  };
}

interface AnimatedProductsSectionProps {
  products: ProductItem[];
}

export function AnimatedProductsSection({ products }: AnimatedProductsSectionProps) {
  // Extract distinct category names
  const categoryNames = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean))),
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category?.name === activeCategory);

  return (
    <section className="py-24 bg-[#f9faf5] relative overflow-hidden" id="featured">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-semibold uppercase tracking-wider mb-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-green-700" />
              Handcrafted Mountain Formulations
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight"
            >
              Featured <span className="text-green-800 italic">Herbal Products</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 mt-2 max-w-xl text-base"
            >
              Time-tested family recipes crafted with cold-pressed extracts, organic mountain herbs, and zero harmful synthetics.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-green-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-xl hover:scale-105"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Scrolltide-style Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10">
          {categoryNames.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected ? "text-white" : "text-gray-600 hover:text-gray-900 bg-white border border-gray-200"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-green-900 rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid with 3D Tilt and Specular Sheen */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <TiltProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function TiltProductCard({ product }: { product: ProductItem }) {
  const { addItem, setIsOpen } = useCart();
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });

  const discount = calculateDiscount(product.price, product.salePrice);
  const primaryImage = getPrimaryImage(product.image, product.images);
  const productUrl = `/shop/products/${encodeURIComponent(slugify(product.slug || product.name))}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: primaryImage || undefined,
    });
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
    >
      {/* Dynamic Specular Light / Spotlight sheen on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: spotlightPos.opacity,
          background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(34, 197, 94, 0.08), transparent 60%)`,
        }}
      />

      <Link href={productUrl} className="block relative aspect-square bg-gradient-to-b from-green-50/60 to-white overflow-hidden p-6">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Package className="w-12 h-12 mb-2 opacity-30" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            -{discount}% OFF
          </span>
        )}

        {/* Weight Badge */}
        {product.weight && (
          <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-gray-100">
            {product.weight}
          </span>
        )}

        {/* Floating Quick Action Button */}
        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-4 right-4 z-20 w-11 h-11 bg-green-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-green-700"
          title={`Add ${product.name} to cart`}
        >
          {added ? <Check className="w-5 h-5 text-white stroke-[3]" /> : <ShoppingCart className="w-4 h-4" />}
        </motion.button>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-green-700">
              {product.category?.name || "Herbal Care"}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-semibold text-gray-700">4.9</span>
            </div>
          </div>

          <Link href={productUrl}>
            <h3 className="font-display font-bold text-base text-gray-900 line-clamp-2 group-hover:text-green-800 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-green-900">
              {formatPrice(product.salePrice || product.price)}
            </div>
            {product.salePrice && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <Link
            href={productUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-950 transition-colors"
          >
            <span>Details</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
