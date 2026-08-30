"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  X,
  Package,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import ProductRichEditor from "@/components/admin/product-editor/rich-editor";
import ImageGalleryManager, { ProductImageItem } from "@/components/admin/product-editor/image-gallery-manager";
import StructuredIngredientsBuilder, { IngredientItem } from "@/components/admin/product-editor/structured-ingredients-builder";
import StructuredHowToUseBuilder, { HowToUseStep } from "@/components/admin/product-editor/structured-how-to-use-builder";
import BenefitsBuilder from "@/components/admin/product-editor/benefits-builder";
import FeaturesBuilder from "@/components/admin/product-editor/features-builder";
import FaqBuilder, { FaqItem } from "@/components/admin/product-editor/faq-builder";
import SerpPreview from "@/components/admin/product-editor/serp-preview";
import SocialPreviews from "@/components/admin/product-editor/social-previews";
import SeoHealthPanel from "@/components/admin/product-editor/seo-health-panel";
import InternalLinksSuggest from "@/components/admin/product-editor/internal-links-suggest";
import ProductPreviewModal from "@/components/admin/product-editor/product-preview-modal";
import { slugify } from "@/lib/slugify";
import { analyzeProductSeo } from "@/lib/product-seo-analyzer";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductSelectItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

interface BlogSelectItem {
  id: string;
  title: string;
  slug: string;
  image: string | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [originalSlug, setOriginalSlug] = useState("");

  // Basic Information
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("PurestStem");
  const [productType, setProductType] = useState("");
  const [condition, setCondition] = useState("New");
  const [gtin, setGtin] = useState("");
  const [mpn, setMpn] = useState("");
  const [unit, setUnit] = useState("piece");
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState("ml");
  const [shortDescription, setShortDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  // Content
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [rawLegacyIngredients, setRawLegacyIngredients] = useState("");
  const [howToUseSteps, setHowToUseSteps] = useState<HowToUseStep[]>([]);
  const [rawLegacyHowToUse, setRawLegacyHowToUse] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Images & SEO
  const [images, setImages] = useState<ProductImageItem[]>([]);

  // SEO Settings
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [secKwInput, setSecKwInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [customCanonical, setCustomCanonical] = useState(false);
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  // Social Overrides
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  // Related Cross-linking
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);

  // Catalogs
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<ProductSelectItem[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogSelectItem[]>([]);

  // Publishing & UI States
  const [status, setStatus] = useState<"published" | "draft" | "scheduled">("published");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load product data and catalogs
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes, allProdRes, blogRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch("/api/categories"),
          fetch("/api/products"),
          fetch("/api/blog"),
        ]);

        if (catRes.ok) setCategories(await catRes.json());
        if (allProdRes.ok) setAllProducts(await allProdRes.json());
        if (blogRes.ok) {
          const bData = await blogRes.json();
          setAllBlogs(bData.posts || bData || []);
        }

        if (prodRes.ok) {
          const p = await prodRes.json();
          setName(p.name || "");
          setSlug(p.slug || "");
          setOriginalSlug(p.slug || "");
          setCategoryId(p.categoryId || "");
          setPrice(p.price !== undefined ? String(p.price) : "");
          setSalePrice(p.salePrice ? String(p.salePrice) : "");
          setStock(p.stock !== undefined ? String(p.stock) : "0");
          setSku(p.sku || "");
          setBrand(p.brand || "PurestStem");
          setProductType(p.productType || "");
          setCondition(p.condition || "New");
          setGtin(p.gtin || "");
          setMpn(p.mpn || "");
          setUnit(p.unit || "piece");
          setWeightValue(p.weightValue ? String(p.weightValue) : (p.weight ? p.weight.replace(/[^0-9.]/g, "") : ""));
          setWeightUnit(p.weightUnit || (p.weight ? p.weight.replace(/[0-9.]/g, "").trim() : "ml"));
          setShortDescription(p.shortDescription || "");
          setDescription(p.description || "");
          setFeatured(!!p.featured);
          setStatus(p.status || (p.isActive ? "published" : "draft"));
          if (p.scheduledAt) setScheduledAt(new Date(p.scheduledAt).toISOString().slice(0, 16));

          setRawLegacyIngredients(p.ingredients || "");
          setRawLegacyHowToUse(p.howToUse || "");

          // Parse Benefits
          if (p.benefits) {
            try {
              const b = typeof p.benefits === "string" ? JSON.parse(p.benefits) : p.benefits;
              if (Array.isArray(b)) setBenefits(b);
            } catch {
              // ignore
            }
          }

          // Parse Features
          if (p.features) {
            try {
              const f = typeof p.features === "string" ? JSON.parse(p.features) : p.features;
              if (Array.isArray(f)) setFeatures(f);
            } catch {
              // ignore
            }
          }

          // Parse Structured Ingredients
          if (p.structuredIngredients) {
            try {
              const ing = typeof p.structuredIngredients === "string" ? JSON.parse(p.structuredIngredients) : p.structuredIngredients;
              if (Array.isArray(ing)) setIngredients(ing);
            } catch {
              // ignore
            }
          }

          // Parse Structured How to Use
          if (p.structuredHowToUse) {
            try {
              const h = typeof p.structuredHowToUse === "string" ? JSON.parse(p.structuredHowToUse) : p.structuredHowToUse;
              if (Array.isArray(h)) setHowToUseSteps(h);
            } catch {
              // ignore
            }
          }

          // Parse FAQs
          if (p.faqs) {
            try {
              const fq = typeof p.faqs === "string" ? JSON.parse(p.faqs) : p.faqs;
              if (Array.isArray(fq)) setFaqs(fq);
            } catch {
              // ignore
            }
          }

          // Parse Images & Image Metadata
          if (p.imageMetadata) {
            try {
              const im = typeof p.imageMetadata === "string" ? JSON.parse(p.imageMetadata) : p.imageMetadata;
              if (Array.isArray(im)) setImages(im);
            } catch {
              // ignore
            }
          } else if (p.images || p.image) {
            const urls: string[] = [];
            if (p.image) urls.push(p.image);
            if (p.images) {
              try {
                const parsed = JSON.parse(p.images);
                if (Array.isArray(parsed)) {
                  for (const u of parsed) {
                    if (!urls.includes(u)) urls.push(u);
                  }
                }
              } catch {
                // ignore
              }
            }
            setImages(urls.map((u, i) => ({
              url: u,
              alt: `${p.name || "PurestStem Product"} image ${i + 1}`,
              sortOrder: i,
            })));
          }

          // SEO Fields
          setSeoTitle(p.seoTitle || "");
          setSeoDescription(p.seoDescription || "");
          setFocusKeyword(p.focusKeyword || "");
          if (p.secondaryKeywords) {
            setSecondaryKeywords(
              p.secondaryKeywords.split(",").map((s: string) => s.trim()).filter(Boolean)
            );
          }
          if (p.canonicalUrl) {
            setCanonicalUrl(p.canonicalUrl);
            setCustomCanonical(true);
          }
          setRobotsIndex(p.robotsIndex !== false);
          setRobotsFollow(p.robotsFollow !== false);

          // Social Overrides
          setOgTitle(p.ogTitle || "");
          setOgDescription(p.ogDescription || "");
          setOgImage(p.ogImage || "");
          setTwitterTitle(p.twitterTitle || "");
          setTwitterDescription(p.twitterDescription || "");
          setTwitterImage(p.twitterImage || "");

          // Related IDs
          if (p.relatedProductIds) {
            try {
              const r = typeof p.relatedProductIds === "string" ? JSON.parse(p.relatedProductIds) : p.relatedProductIds;
              if (Array.isArray(r)) setSelectedProductIds(r);
            } catch {
              // ignore
            }
          }
          if (p.relatedBlogIds) {
            try {
              const rb = typeof p.relatedBlogIds === "string" ? JSON.parse(p.relatedBlogIds) : p.relatedBlogIds;
              if (Array.isArray(rb)) setSelectedBlogIds(rb);
            } catch {
              // ignore
            }
          }
        }
      } catch {
        setErrorMessage("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value));
  }

  function addSecKeyword(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = secKwInput.trim();
      if (trimmed && !secondaryKeywords.includes(trimmed)) {
        setSecondaryKeywords([...secondaryKeywords, trimmed]);
        setSecKwInput("");
      }
    }
  }

  function removeSecKeyword(kw: string) {
    setSecondaryKeywords(secondaryKeywords.filter((k) => k !== kw));
  }

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  // Live SEO Content Health Analysis
  const seoAnalysis = useMemo(() => {
    return analyzeProductSeo({
      name,
      slug,
      description,
      shortDescription,
      categoryId,
      categoryName: selectedCategoryObj?.name,
      price,
      salePrice,
      stock,
      sku,
      brand,
      productType,
      condition,
      gtin,
      mpn,
      weight: weightValue ? `${weightValue}${weightUnit}` : "",
      weightValue,
      weightUnit,
      benefits,
      features,
      structuredIngredients: ingredients,
      structuredHowToUse: howToUseSteps,
      images,
      primaryImage: images.length > 0 ? images[0].url : "",
      seoTitle,
      seoDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl: customCanonical ? canonicalUrl : undefined,
      robotsIndex,
      robotsFollow,
      faqs,
      relatedProductIds: selectedProductIds,
      relatedBlogIds: selectedBlogIds,
      status,
    });
  }, [
    name,
    slug,
    description,
    shortDescription,
    categoryId,
    selectedCategoryObj,
    price,
    salePrice,
    stock,
    sku,
    brand,
    productType,
    condition,
    gtin,
    mpn,
    weightValue,
    weightUnit,
    benefits,
    features,
    ingredients,
    howToUseSteps,
    images,
    seoTitle,
    seoDescription,
    focusKeyword,
    secondaryKeywords,
    canonicalUrl,
    customCanonical,
    robotsIndex,
    robotsFollow,
    faqs,
    selectedProductIds,
    selectedBlogIds,
    status,
  ]);

  function handleInsertSuggestedLink(linkUrl: string, linkTitle: string) {
    const linkHtml = `<a href="${linkUrl}" class="text-green-700 underline font-medium">${linkTitle}</a>`;
    setDescription((prev) => prev + `<p>${linkHtml}</p>`);
  }

  async function handleSubmit(targetStatus: "published" | "draft" | "scheduled") {
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Product Name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("URL Slug is required.");
      return;
    }
    if (!categoryId) {
      setErrorMessage("Please select a Product Category.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage("Please enter a valid regular price.");
      return;
    }
    if (salePrice) {
      const numSale = parseFloat(salePrice);
      if (isNaN(numSale) || numSale < 0) {
        setErrorMessage("Sale price must be a positive number.");
        return;
      }
      if (numSale >= numPrice) {
        setErrorMessage(`Sale price (Rs. ${numSale}) must be less than regular price (Rs. ${numPrice}).`);
        return;
      }
    }

    if (targetStatus === "scheduled" && !scheduledAt) {
      setErrorMessage("Please specify the scheduled publication date and time.");
      return;
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.isDecorative && (!img.alt || !img.alt.trim())) {
        setErrorMessage(`Image #${i + 1} is missing required Alt Text description.`);
        return;
      }
    }

    setSubmitting(true);

    const fullWeightStr = weightValue ? `${weightValue}${weightUnit}` : "";

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      categoryId,
      price: numPrice,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      stock: parseInt(stock || "0", 10),
      sku: sku.trim() || null,
      brand: brand.trim() || "PurestStem",
      productType: productType.trim() || null,
      condition,
      gtin: gtin.trim() || null,
      mpn: mpn.trim() || null,
      unit: unit.trim() || "piece",
      weight: fullWeightStr || null,
      weightValue: weightValue ? parseFloat(weightValue) : null,
      weightUnit,
      shortDescription: shortDescription.trim() || null,
      description: description || null,
      benefits,
      features,
      structuredIngredients: ingredients,
      ingredients: rawLegacyIngredients.trim() || ingredients.map((i) => i.name).join(", ") || null,
      structuredHowToUse: howToUseSteps,
      howToUse: rawLegacyHowToUse.trim() || howToUseSteps.map((s) => `${s.step}. ${s.instruction}`).join("\n") || null,
      faqs,
      image: images.length > 0 ? images[0].url : null,
      images: images.map((img) => img.url),
      imageMetadata: images,
      featured,
      isActive: targetStatus === "published",
      status: targetStatus,
      scheduledAt: targetStatus === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      focusKeyword: focusKeyword.trim() || null,
      secondaryKeywords: secondaryKeywords.join(", "),
      canonicalUrl: customCanonical && canonicalUrl ? canonicalUrl.trim() : null,
      robotsIndex,
      robotsFollow,
      ogTitle: ogTitle.trim() || null,
      ogDescription: ogDescription.trim() || null,
      ogImage: ogImage || (images.length > 0 ? images[0].url : null),
      twitterTitle: twitterTitle.trim() || null,
      twitterDescription: twitterDescription.trim() || null,
      twitterImage: twitterImage || (images.length > 0 ? images[0].url : null),
      relatedProductIds: selectedProductIds,
      relatedBlogIds: selectedBlogIds,
    };

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Failed to update product.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl py-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-green-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Loading product CMS editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product: {name || "Product"}</h1>
            <p className="text-xs text-gray-500">
              Professional SEO-First eCommerce CMS • PurestStem
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/shop/products/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Draft
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("published")}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {originalSlug && slug !== originalSlug && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <span>
            <strong>Slug Changed:</strong> Saving will automatically create a 301 permanent redirect from{" "}
            <code>/shop/products/{originalSlug}</code> to <code>/shop/products/{slug}</code> to protect SEO ranking.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Product Content & Data (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section A: Basic Product Information & Identifiers */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Package className="w-4 h-4 text-green-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                A. Product Information & Identifiers
              </h2>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PurestStem Hair Repairing Ultra Shampoo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  /shop/products/{slug || "your-product-slug"}
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="pureststem-hair-repairing-shampoo"
                value={slug}
                onChange={handleSlugChange}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Category & Brand Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="PurestStem"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Price & Sale Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Regular Price (PKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-gray-400 font-semibold">₨</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="1450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sale Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-gray-400 font-semibold">₨</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="1200 (Optional discount price)"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                {salePrice && price && parseFloat(salePrice) >= parseFloat(price) && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">
                    Sale price must be less than regular price.
                  </p>
                )}
              </div>
            </div>

            {/* Stock, SKU & Net Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="PS-SH-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Net Weight / Volume</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="250"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="w-2/3 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="w-1/3 px-2 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="ml">ml</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="l">L</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Condition, GTIN, MPN & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Barcode / GTIN</label>
                <input
                  type="text"
                  placeholder="Real GTIN-13/12"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">MPN</label>
                <input
                  type="text"
                  placeholder="Manufacturer Part #"
                  value={mpn}
                  onChange={(e) => setMpn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Package Unit</label>
                <input
                  type="text"
                  placeholder="bottle, jar, pack"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Short Description (Overview)
                </label>
                <span className="text-[11px] text-gray-400">
                  {shortDescription.length}/200 chars
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="A compelling 1-2 sentence overview for product cards, SERP snippets, and social share previews..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Section B: Product Description (Rich Text Editor) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  B. Product Description & Story
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {seoAnalysis.wordCount} words
              </span>
            </div>

            <ProductRichEditor
              value={description}
              onChange={setDescription}
              placeholder="Write detailed product information, botanical benefits, usage guidelines, and customer FAQs..."
            />
          </div>

          {/* Section C: Product Benefits & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenefitsBuilder benefits={benefits} onChange={setBenefits} />
            <FeaturesBuilder features={features} onChange={setFeatures} />
          </div>

          {/* Section D: Structured Ingredients & How to Use */}
          <div className="space-y-6">
            <StructuredIngredientsBuilder
              ingredients={ingredients}
              onChange={setIngredients}
              rawLegacyText={rawLegacyIngredients}
              onLegacyTextChange={setRawLegacyIngredients}
            />

            <StructuredHowToUseBuilder
              steps={howToUseSteps}
              onChange={setHowToUseSteps}
              rawLegacyText={rawLegacyHowToUse}
              onLegacyTextChange={setRawLegacyHowToUse}
            />
          </div>

          {/* Section E: Product Images & Image SEO Gallery */}
          <ImageGalleryManager
            images={images}
            onChange={setImages}
            productName={name}
          />

          {/* Section F: Frequently Asked Questions */}
          <FaqBuilder faqs={faqs} onChange={setFaqs} />

          {/* Section G: Related Products & Related Articles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Sparkles className="w-4 h-4 text-green-700" />
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  G. Internal Linking (Related Products & Articles)
                </h2>
                <p className="text-xs text-gray-500">
                  Select related products and herbal articles to feature as crawlable links on this product page.
                </p>
              </div>
            </div>

            {/* Related Products Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Related Products (Multi-select)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allProducts
                  .filter((p) => p.id !== id)
                  .map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedProductIds(selectedProductIds.filter((prodId) => prodId !== p.id));
                          } else {
                            setSelectedProductIds([...selectedProductIds, p.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "border-green-600 bg-green-50/80 ring-2 ring-green-600/30"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
                          <div className="text-[11px] text-green-700 font-medium">Rs. {p.price.toLocaleString()}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Related Blog Articles Picker */}
            {allBlogs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700">
                  Related Herbal Guides & Blog Posts
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allBlogs.map((b) => {
                    const isSelected = selectedBlogIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedBlogIds(selectedBlogIds.filter((blogId) => blogId !== b.id));
                          } else {
                            setSelectedBlogIds([...selectedBlogIds, b.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "border-green-600 bg-green-50/80 ring-2 ring-green-600/30"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {b.image ? (
                            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-gray-900 truncate">{b.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate">/blog/{b.slug}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SEO Settings, Health, Previews & Publishing (4 cols, sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* 1. Publishing & Status Action Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Publishing & Status
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft" | "scheduled")}
                className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="published">Published (Live & Indexable)</option>
                <option value="draft">Draft (Private & Noindex)</option>
                <option value="scheduled">Scheduled (Auto-publish at date/time)</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                <label className="block text-xs font-semibold text-amber-900">
                  Publication Date & Time (PKT)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white outline-none"
                />
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("published")}
                className="w-full py-2.5 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save & Update Product"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit("draft")}
                  className="w-full py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-all"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-all"
                >
                  Live Preview
                </button>
              </div>
            </div>
          </div>

          {/* 2. SEO Content Health Score Panel */}
          <SeoHealthPanel analysis={seoAnalysis} />

          {/* 3. Dedicated SEO Metadata Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Product SEO Metadata
            </h3>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  SEO Title (Meta Title)
                </label>
                <span className={`text-[11px] font-mono ${
                  seoTitle.length > 70 ? "text-amber-600 font-bold" : seoTitle.length >= 35 ? "text-green-700" : "text-gray-400"
                }`}>
                  {seoTitle.length}/65 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. PurestStem Hair Repairing Shampoo | Herbal Care"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Meta Description
                </label>
                <span className={`text-[11px] font-mono ${
                  seoDescription.length > 165 ? "text-amber-600 font-bold" : seoDescription.length >= 120 ? "text-green-700" : "text-gray-400"
                }`}>
                  {seoDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Discover PurestStem Hair Repairing Shampoo, crafted with organic Amla, Reetha, and Aloe Vera in Pakistan..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. hair repairing shampoo"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {focusKeyword && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    seoAnalysis.keywordPlacements.inName ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                  }`}>
                    {seoAnalysis.keywordPlacements.inName ? "✓" : "○"} in Title
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    seoAnalysis.keywordPlacements.inMetaDesc ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                  }`}>
                    {seoAnalysis.keywordPlacements.inMetaDesc ? "✓" : "○"} in Meta Desc
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    seoAnalysis.keywordPlacements.inSlug ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                  }`}>
                    {seoAnalysis.keywordPlacements.inSlug ? "✓" : "○"} in Slug
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    seoAnalysis.keywordPlacements.inDescription ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                  }`}>
                    {seoAnalysis.keywordPlacements.inDescription ? "✓" : "○"} in Description
                  </span>
                </div>
              )}
            </div>

            {/* Secondary Keywords */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Secondary Keywords (Press Enter)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-xl min-h-[38px] bg-white items-center">
                {secondaryKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 bg-green-50 text-green-900 text-[11px] font-medium px-2 py-0.5 rounded-md border border-green-200"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeSecKeyword(kw)}
                      className="text-green-600 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={secondaryKeywords.length === 0 ? "organic shampoo, herbal hair care..." : "Add keyword..."}
                  value={secKwInput}
                  onChange={(e) => setSecKwInput(e.target.value)}
                  onKeyDown={addSecKeyword}
                  className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Canonical URL */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">Canonical URL</label>
                <label className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customCanonical}
                    onChange={(e) => setCustomCanonical(e.target.checked)}
                    className="rounded text-green-700 focus:ring-green-600"
                  />
                  <span>Custom override</span>
                </label>
              </div>

              {customCanonical ? (
                <input
                  type="url"
                  placeholder="https://pureststem.com/shop/products/..."
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 font-mono truncate">
                  Default: /shop/products/{slug || "slug"}
                </div>
              )}
            </div>

            {/* Robots Configuration */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Search Engine Indexing</label>
              <div className="flex items-center gap-4 text-xs text-gray-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="rounded text-green-700 focus:ring-green-600"
                  />
                  <span>Index (index)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="rounded text-green-700 focus:ring-green-600"
                  />
                  <span>Follow links (follow)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. Google SERP Preview */}
          <SerpPreview
            title={name}
            slug={slug}
            description={description}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            price={price}
            salePrice={salePrice}
            stock={stock}
            brand={brand}
          />

          {/* 5. Social Share Previews */}
          <SocialPreviews
            title={name}
            description={shortDescription || description}
            imageUrl={images.length > 0 ? images[0].url : ""}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            ogTitle={ogTitle}
            ogDescription={ogDescription}
            ogImage={ogImage}
            twitterTitle={twitterTitle}
            twitterDescription={twitterDescription}
            twitterImage={twitterImage}
            slug={slug}
            price={price}
          />

          {/* 6. Internal Links Suggest Explorer */}
          <InternalLinksSuggest onInsertLink={handleInsertSuggestedLink} />
        </div>
      </div>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        product={{
          name,
          slug,
          price,
          salePrice,
          stock,
          sku,
          weight: weightValue ? `${weightValue}${weightUnit}` : "",
          brand,
          condition,
          shortDescription,
          description,
          benefits,
          features,
          structuredIngredients: ingredients,
          structuredHowToUse: howToUseSteps,
          faqs,
          images,
          categoryName: selectedCategoryObj?.name,
        }}
      />
    </div>
  );
}
