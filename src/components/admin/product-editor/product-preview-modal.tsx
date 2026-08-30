"use client";

import { X, Star, Leaf, Sparkles, Check, Truck, Banknote, ShieldCheck, Heart, Package, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    slug: string;
    price: number | string;
    salePrice?: number | string | null;
    stock: number | string;
    sku?: string;
    weight?: string;
    brand?: string;
    condition?: string;
    shortDescription?: string;
    description?: string;
    benefits?: string[];
    features?: string[];
    structuredIngredients?: Array<{ name: string; description?: string }>;
    structuredHowToUse?: Array<{ step: number; instruction: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    images?: Array<{ url: string; alt?: string }>;
    categoryName?: string;
  };
}

export default function ProductPreviewModal({
  isOpen,
  onClose,
  product,
}: ProductPreviewModalProps) {
  if (!isOpen) return null;

  const numPrice = Number(product.price) || 0;
  const numSalePrice = product.salePrice ? Number(product.salePrice) : null;
  const primaryImg = product.images && product.images.length > 0 ? product.images[0].url : "";
  const effectivePrice = numSalePrice && numSalePrice > 0 ? numSalePrice : numPrice;
  const savings = numSalePrice && numSalePrice > 0 ? numPrice - numSalePrice : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#f9faf5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-200 shadow-2xl relative">
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-3 border-b border-gray-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Storefront Preview
            </span>
            <span className="text-xs text-gray-500 font-mono">/shop/products/{product.slug || "product-slug"}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storefront Content Simulation */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span>{product.categoryName || "Herbal Care"}</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name || "Untitled Product"}</span>
          </div>

          {/* Top Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gallery Image Simulation */}
            <div className="space-y-3">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center relative">
                {primaryImg ? (
                  <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-2 opacity-40" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}
                {savings > 0 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Save {formatPrice(savings)}
                  </span>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Purchasing Box */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {product.categoryName || "Herbal"}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Brand: {product.brand || "PurestStem"}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Condition: {product.condition || "New"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-tight">
                {product.name || "Product Name"}
              </h1>

              {/* Price Row */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-green-700">
                  {formatPrice(effectivePrice)}
                </span>
                {numSalePrice && numSalePrice > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(numPrice)}
                  </span>
                )}
                <span className="text-xs text-gray-400">Tax inclusive</span>
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-green-50/60 p-3 rounded-xl border border-green-100">
                  {product.shortDescription}
                </p>
              )}

              {/* Quick specs pill grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">Availability</span>
                  <span className="font-bold text-gray-900">
                    {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">Net Weight</span>
                  <span className="font-bold text-gray-900">{product.weight || "Standard"}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">SKU Code</span>
                  <span className="font-bold text-gray-900">{product.sku || "N/A"}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">Shipping</span>
                  <span className="font-bold text-gray-900">COD Available</span>
                </div>
              </div>

              {/* Add to Cart Simulation */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-green-700 text-white rounded-2xl font-bold text-sm shadow-md"
                >
                  Add to Cart • {formatPrice(effectivePrice)}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-gray-600">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-green-700" />
                  <span>Nationwide Shipping</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-green-700" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <Heart className="w-4 h-4 mx-auto mb-1 text-green-700" />
                  <span>100% Botanical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features badges */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-green-100 text-green-900 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-900">Key Botanical Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Structured Ingredients */}
          {product.structuredIngredients && product.structuredIngredients.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Botanical Actives & Ingredients</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.structuredIngredients.map((item, i) => (
                  <div key={i} className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <h4 className="text-xs font-bold text-green-950">{item.name}</h4>
                    {item.description && (
                      <p className="text-[11px] text-gray-600 mt-0.5">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use Steps */}
          {product.structuredHowToUse && product.structuredHowToUse.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">How to Use (Simple Steps)</h3>
              <div className="space-y-2.5">
                {product.structuredHowToUse.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-green-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step || i + 1}
                    </span>
                    <span className="pt-0.5">{step.instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rich Description */}
          {product.description && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-900">Full Description</h3>
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="prose prose-sm max-w-none text-gray-700 text-xs"
              />
            </div>
          )}

          {/* FAQs */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="font-semibold text-gray-900">{faq.question}</div>
                    <div className="text-gray-600 mt-1">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
