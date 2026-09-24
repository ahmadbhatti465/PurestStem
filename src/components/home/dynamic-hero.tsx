"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Star,
  BadgeCheck,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  Eye,
  MessageCircle,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";

export interface HeroProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  images?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  weight?: string | null;
  benefits?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface DynamicHeroProps {
  products: HeroProduct[];
}

export function DynamicHero({ products }: DynamicHeroProps) {
  // Curated hero showcases
  const curatedItems: HeroProduct[] = [
    {
      id: "hero-bundle-trio",
      name: "Complete Mountain Hair Care Trio",
      slug: "products",
      price: 2050,
      salePrice: 1850,
      image: "/hero-section.png",
      weight: "Oil + 2 Shampoos",
      shortDescription:
        "Our complete 3-step botanical treatment: Hair Repairing Oil (150ml) paired with 2 gentle herbal cleansers for maximum follicle revival.",
      category: { id: "cat-1", name: "Heritage Trio", slug: "bundles" },
    },
    {
      id: "hero-oil",
      name: "PurestStem Hair Repairing Oil",
      slug: "hair-repairing-oil",
      price: 650,
      salePrice: null,
      image: "https://iaa2wq3m6coy4wgs.public.blob.vercel-storage.com/products/1786200532048-oil__8_.png",
      weight: "150ml",
      shortDescription:
        "Cold-pressed Amla, Bhringraj, Rosemary & Onion seed oil. Formulated to stop hair shedding and stimulate dormant roots.",
      category: { id: "cat-2", name: "Targeted Oil Therapy", slug: "hair-oil" },
    },
    {
      id: "hero-repair-shampoo",
      name: "PurestStem Hair Repairing Shampoo",
      slug: "shampoo",
      price: 800,
      salePrice: 800,
      image: "https://iaa2wq3m6coy4wgs.public.blob.vercel-storage.com/products/1786200989874-oil__9_.png",
      weight: "200ml",
      shortDescription:
        "Sulfate-free botanical cleanser infused with Aloe Vera, Argan oil, and Green Tea. Rebuilds fragile, chemically treated hair.",
      category: { id: "cat-3", name: "Sulfate-Free Cleanser", slug: "shampoo" },
    },
    {
      id: "hero-herbal-shampoo",
      name: "PurestStem Herbal Scalp Shampoo",
      slug: "herbalshampoo",
      price: 600,
      salePrice: 600,
      image: "https://iaa2wq3m6coy4wgs.public.blob.vercel-storage.com/products/1786359841606-WhatsApp_Image_2026-08-10_at_4.02.10_PM.jpeg",
      weight: "200ml",
      shortDescription:
        "Daily gentle foaming formula with mountain Neem, Chamomile, and Vitamin E to soothe itchy dandruff and purify roots.",
      category: { id: "cat-4", name: "Daily Scalp Care", slug: "shampoo" },
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, setIsOpen } = useCart();

  const activeItem = curatedItems[selectedIndex];

  // Auto-cycle every 7 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % curatedItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, curatedItems.length]);

  const discount = calculateDiscount(activeItem.price, activeItem.salePrice);
  const rawImage = getPrimaryImage(activeItem.image, activeItem.images) || "/hero-section.png";
  const [currentImg, setCurrentImg] = useState(rawImage);

  useEffect(() => {
    setCurrentImg(rawImage);
  }, [rawImage, selectedIndex]);

  const productUrl =
    activeItem.id === "hero-bundle-trio"
      ? "/shop/products"
      : `/shop/products/${encodeURIComponent(slugify(activeItem.slug || activeItem.name))}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: activeItem.id,
      name: activeItem.name,
      price: activeItem.salePrice || activeItem.price,
      quantity: 1,
      image: currentImg,
    });
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section
      className="relative bg-gradient-to-b from-[#ffffff] via-[#f8faf5] to-[#edf4e8] text-gray-900 overflow-hidden py-6 lg:py-10 border-b border-emerald-100/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-10 w-[45rem] h-[45rem] rounded-full bg-emerald-200/35 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-amber-100/50 blur-[150px]" />
        <Leaf className="absolute -right-12 top-10 w-96 h-96 text-emerald-900/[0.03] rotate-12" strokeWidth={1} />
        <Leaf className="absolute -left-12 bottom-10 w-80 h-80 text-green-900/[0.03] -rotate-45" strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-gray-200/80 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-900 font-bold">
              EST. 1964 • 60+ Years of Himalayan Herbal Excellence
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-mono">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-gray-700">
              <Truck className="w-3.5 h-3.5 text-emerald-700" /> Cash on Delivery Across Pakistan
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 100% Wild Mountain Herbs
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9/5 (12,480+ Verified Reviews)
            </span>
          </div>
        </div>

        {/* 2-Column Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT: Prestigious Brand Narrative & Direct Buying Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs uppercase tracking-wider mb-3.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Wildcrafted Himalayan Botanicals</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950 leading-[1.14] mb-3.5">
              Natural Hair Regrowth.{" "}
              <span className="italic font-normal text-emerald-800">
                Backed by 60 Years of Heritage.
              </span>
            </h1>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-xl font-normal">
              Stop rapid hair fall, eliminate stubborn dandruff, and stimulate thicker growth with time-honored cold-macerated formulas. Handcrafted with wildcrafted Himalayan Amla, Bhringraj, Rosemary & Coconut. 0% sulfates, parabens, or artificial perfumes.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-6">
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-green-900 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-green-800 hover:scale-105 transition-all cursor-pointer"
              >
                <span>Shop Herbal Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/923334117668?text=Hello%20PurestStem%2C%20I%20want%20to%20order%20herbal%20products%20with%20Cash%20on%20Delivery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-emerald-50/50 border-2 border-green-800/20 hover:border-green-800 text-green-950 font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                Order on WhatsApp
              </a>
            </div>

            {/* Social Proof Bar */}
            <div className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-white/90 border border-gray-200/80 shadow-xs mb-5 w-full max-w-lg">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                  AM
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                  FQ
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">
                  ZT
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-green-900 text-white text-[10px] font-bold flex items-center justify-center">
                  HB
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-gray-900 ml-1">4.9 / 5</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Over 12,480+ happy customers across Pakistan
                </p>
              </div>
            </div>

            {/* Core Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200/80 w-full text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>Nationwide COD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>100% Original Herbs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>7-Day Guarantee</span>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Impact Botanical Bottle Showcase (Hero Images Block) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* The Main Showcase Card */}
            <div className="w-full max-w-[460px] rounded-3xl bg-white border border-gray-200/80 shadow-[0_20px_50px_-15px_rgba(26,74,46,0.12)] p-5 sm:p-6 flex flex-col justify-between">
              
              {/* Card Top Strip */}
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-emerald-900 font-mono text-[11px] uppercase font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  PurestStem Apothecary
                </div>
                <div className="bg-emerald-50 border border-emerald-200 shadow-xs rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-900">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Lab Tested & Certified
                </div>
              </div>

              {/* Explicit Center Bottle Area (Guaranteed Height, Never Collapses) */}
              <div className="relative w-full h-[220px] sm:h-[240px] flex items-center justify-center my-2 bg-gradient-to-b from-[#fbfdf9] to-[#f4f7ef] rounded-2xl border border-gray-100/80 overflow-hidden">
                
                {/* Soft ambient radial glow */}
                <div className="absolute w-[70%] aspect-square rounded-full bg-gradient-to-tr from-emerald-100/40 via-amber-50/50 to-transparent blur-2xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-full h-full flex items-center justify-center p-3 z-10"
                  >
                    <Link href={productUrl} className="block w-full h-full flex items-center justify-center">
                      <img
                        src={currentImg}
                        alt={activeItem.name}
                        onError={() => setCurrentImg("/hero-section.png")}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_22px_rgba(15,40,25,0.14)] transition-transform duration-500 hover:scale-105"
                        loading="eager"
                      />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Product Info & Quick Buy Bar */}
              <div className="w-full bg-[#f9faf6] rounded-2xl p-3.5 border border-gray-200/80 shadow-xs flex items-center justify-between gap-3 mt-1">
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-emerald-800 font-mono uppercase font-bold tracking-wider">
                      {activeItem.category.name}
                    </span>
                    {activeItem.weight && (
                      <span className="text-[10px] text-gray-500 font-mono">
                        • {activeItem.weight}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        Save {discount}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                    {activeItem.name}
                  </p>

                  <p className="text-sm sm:text-base font-extrabold text-green-900 mt-0.5">
                    {formatPrice(activeItem.salePrice || activeItem.price)}
                    {activeItem.salePrice && (
                      <span className="text-xs text-gray-400 font-normal line-through ml-1.5">
                        {formatPrice(activeItem.price)}
                      </span>
                    )}
                    <span className="text-[10px] font-normal text-emerald-700 ml-1 font-mono">
                      (COD Available)
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <motion.button
                    onClick={handleAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1 bg-green-900 hover:bg-green-800 text-white font-bold px-3 py-2 rounded-xl shadow-xs transition-all text-xs cursor-pointer"
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" /> Quick Buy
                      </>
                    )}
                  </motion.button>

                  <Link
                    href={productUrl}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-green-900 transition-colors shadow-xs"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Integrated Switcher Tabs (4 Curated Bottles) */}
              <div className="w-full mt-3 grid grid-cols-4 gap-1.5 pt-2 border-t border-gray-100">
                {curatedItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const thumb = getPrimaryImage(item.image, item.images) || "/hero-section.png";
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedIndex(idx);
                        setIsPaused(true);
                      }}
                      className={`relative p-1.5 rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer text-center ${
                        isSelected
                          ? "bg-green-50 border-2 border-green-800 text-green-950 shadow-xs"
                          : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/70"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 mb-0.5">
                        <img src={thumb} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-bold line-clamp-1 leading-tight text-gray-900">
                        {idx === 0 ? "Full Trio" : item.weight || item.name.split(" ")[1]}
                      </span>
                      <span className="text-[9px] font-mono text-green-800 font-bold">
                        ₨ {item.salePrice || item.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
