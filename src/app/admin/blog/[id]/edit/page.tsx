"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Clock,
  Eye,
  ImageIcon,
  Upload,
  Info,
  X,
  Plus,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  Package,
  AlertTriangle,
} from "lucide-react";
import RichEditor from "@/components/admin/blog-editor/rich-editor";
import FaqBuilder, { FaqItem } from "@/components/admin/blog-editor/faq-builder";
import SerpPreview from "@/components/admin/blog-editor/serp-preview";
import SocialPreviews from "@/components/admin/blog-editor/social-previews";
import SeoHealthPanel from "@/components/admin/blog-editor/seo-health-panel";
import InternalLinksSuggest from "@/components/admin/blog-editor/internal-links-suggest";
import { slugify } from "@/lib/slugify";
import { analyzeBlogSeo } from "@/lib/seo-analyzer";
import { toDateTimeLocalValue } from "@/lib/visibility";
import { uploadImage } from "@/lib/upload-client";
import { escapeAttr, escapeHtml } from "@/lib/html-sanitizer";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Sent back on save so the server can refuse to overwrite someone else's newer edit.
  const [loadedUpdatedAt, setLoadedUpdatedAt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Original post state for detecting 301 redirect requirement
  const [originalSlug, setOriginalSlug] = useState("");
  const [originalStatus, setOriginalStatus] = useState("published");

  // Basic info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("PurestStem Herbal Experts");
  const [authorBio, setAuthorBio] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Related products
  const [allProducts, setAllProducts] = useState<Array<{ id: string; name: string; price: number; image: string | null }>>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Categories
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Featured Image
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const [imageHeight, setImageHeight] = useState<number | undefined>(undefined);
  const [isDecorative, setIsDecorative] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // FAQ
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Publishing
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">("published");
  const [scheduledAt, setScheduledAt] = useState("");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  // Load Post and Metadata
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [postRes, catRes, prodRes] = await Promise.all([
          fetch(`/api/admin/blog/${id}`),
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setAllProducts(prodData);
        }

        if (postRes.ok) {
          const post = await postRes.json();
          setTitle(post.title || "");
          setSlug(post.slug || "");
          setOriginalSlug(post.slug || "");
          setExcerpt(post.excerpt || "");
          setContent(post.content || "");
          setAuthor(post.author || "PurestStem Herbal Experts");
          setAuthorBio(post.authorBio || "");
          setCategoryId(post.categoryId || "");

          if (post.tags) {
            setTags(
              typeof post.tags === "string"
                ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                : Array.isArray(post.tags)
                ? post.tags
                : []
            );
          }

          setImageUrl(post.image || "");
          setImageAlt(post.imageAlt || "");
          setImageCaption(post.imageCaption || "");
          setImageCredit(post.imageCredit || "");
          setImageWidth(post.imageWidth || undefined);
          setImageHeight(post.imageHeight || undefined);
          setIsDecorative(post.imageAlt === "");

          setSeoTitle(post.seoTitle || "");
          setSeoDescription(post.seoDescription || "");
          setFocusKeyword(post.focusKeyword || "");
          if (post.secondaryKeywords) {
            setSecondaryKeywords(
              typeof post.secondaryKeywords === "string"
                ? post.secondaryKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
                : Array.isArray(post.secondaryKeywords)
                ? post.secondaryKeywords
                : []
            );
          }

          if (post.canonicalUrl) {
            setCanonicalUrl(post.canonicalUrl);
            setCustomCanonical(true);
          }

          setRobotsIndex(post.robotsIndex ?? true);
          setRobotsFollow(post.robotsFollow ?? true);

          setOgTitle(post.ogTitle || "");
          setOgDescription(post.ogDescription || "");
          setOgImage(post.ogImage || "");
          setTwitterTitle(post.twitterTitle || "");
          setTwitterDescription(post.twitterDescription || "");
          setTwitterImage(post.twitterImage || "");

          if (post.faqs) {
            try {
              const parsedFaqs = typeof post.faqs === "string" ? JSON.parse(post.faqs) : post.faqs;
              if (Array.isArray(parsedFaqs)) setFaqs(parsedFaqs);
            } catch (e) {
              console.error("Error parsing FAQs:", e);
            }
          }

          if (post.relatedProductIds) {
            try {
              const parsedProds =
                typeof post.relatedProductIds === "string"
                  ? JSON.parse(post.relatedProductIds)
                  : post.relatedProductIds;
              if (Array.isArray(parsedProds)) setSelectedProductIds(parsedProds);
            } catch (e) {
              console.error("Error parsing related products:", e);
            }
          }

          const st = post.status || (post.published ? "published" : "draft");
          setStatus(st);
          setOriginalStatus(st);
          if (post.scheduledAt) setScheduledAt(toDateTimeLocalValue(post.scheduledAt));
          if (post.publishedAt) setPublishedAt(post.publishedAt);
          setLoadedUpdatedAt(post.updatedAt ?? null);
        } else {
          setLoadError(
            postRes.status === 404
              ? "This article doesn't exist. It may have been deleted."
              : "Failed to load blog post."
          );
        }
      } catch {
        setLoadError("Network error while loading post.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Tags handling
  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  // Secondary Keywords handling
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

  // Handle Image Upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage("");

    try {
      const result = await uploadImage(file, "blog");
      if (result.ok) {
        setImageUrl(result.url);
        if (result.width) setImageWidth(result.width);
        if (result.height) setImageHeight(result.height);
      } else {
        setErrorMessage(result.error);
      }
    } finally {
      setUploadingImage(false);
    }
  }

  // SEO Analysis
  const seoAnalysis = useMemo(() => {
    return analyzeBlogSeo({
      title,
      slug,
      content,
      excerpt,
      seoTitle,
      seoDescription,
      focusKeyword,
      secondaryKeywords,
      featuredImage: imageUrl,
      featuredImageAlt: imageAlt,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      faqs,
      author,
      categoryId,
    });
  }, [
    title,
    slug,
    content,
    excerpt,
    seoTitle,
    seoDescription,
    focusKeyword,
    secondaryKeywords,
    imageUrl,
    imageAlt,
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    faqs,
    author,
    categoryId,
  ]);

  function handleInsertSuggestedLink(linkUrl: string, linkTitle: string) {
    const linkHtml = `<a href="${escapeAttr(linkUrl)}" class="text-green-700 underline font-medium">${escapeHtml(linkTitle)}</a>`;
    setContent((prev) => prev + `<p>${linkHtml}</p>`);
  }

  // Submit Handler
  async function handleSubmit(targetStatus: "draft" | "scheduled" | "published") {
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Article Title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("URL Slug is required.");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Article Content is required.");
      return;
    }

    if (imageUrl && !isDecorative && !imageAlt.trim()) {
      setErrorMessage("Featured Image Alt Text is required. Please describe the image.");
      return;
    }

    if (targetStatus === "scheduled" && !scheduledAt) {
      setErrorMessage("Please select a scheduled publication date and time.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      image: imageUrl || null,
      imageAlt: isDecorative ? "" : imageAlt.trim() || null,
      imageCaption: imageCaption.trim() || null,
      imageCredit: imageCredit.trim() || null,
      imageWidth,
      imageHeight,
      author: author.trim(),
      authorBio: authorBio.trim() || null,
      categoryId: categoryId || null,
      tags: tags.join(", "),
      status: targetStatus,
      published: targetStatus === "published",
      publishedAt: targetStatus === "published" && !publishedAt ? new Date().toISOString() : publishedAt,
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
      ogImage: ogImage || null,
      twitterTitle: twitterTitle.trim() || null,
      twitterDescription: twitterDescription.trim() || null,
      twitterImage: twitterImage || null,
      faqs,
      relatedProductIds: selectedProductIds,
      expectedUpdatedAt: loadedUpdatedAt,
    };

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        setErrorMessage(data.error || `Failed to update article (error ${res.status}).`);
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && loadError) {
    return (
      <div className="max-w-xl py-12 space-y-4">
        <p className="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">{loadError}</p>
        <a href="/admin/blog" className="text-sm text-green-700 hover:underline">
          ← Back to blog posts
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  const isSlugChanged = originalSlug && slug && originalSlug !== slug;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-xs text-gray-500">
              Editing: <span className="font-mono text-green-800 font-medium">/blog/{originalSlug}</span>
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/blog/${slug || originalSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View Live
          </Link>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(status)}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Saving Changes..." : "Save & Update"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 301 Redirect Alert if Slug Modified */}
      {isSlugChanged && (originalStatus === "published") && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>301 Permanent Redirect Will Be Created:</strong> You are changing the published URL from{" "}
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">/blog/{originalSlug}</code> to{" "}
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">/blog/{slug}</code>. A 301 redirect will be logged automatically to preserve SEO rank and avoid 404 broken links.
          </div>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Editor Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section A: Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <FileText className="w-4 h-4 text-green-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                A. Basic Information
              </h2>
            </div>

            {/* Article Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  /blog/{slug || "your-slug"}
                </span>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Summary / Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Category & Author Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select a Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Article Tags (Press Enter or comma to add)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-xl min-h-[42px] bg-white items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-green-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-green-600 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section B: Rich Blog Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  B. Blog Content
                </h2>
              </div>
              <span className="text-xs text-gray-500">
                {seoAnalysis.wordCount} words • ~{seoAnalysis.readingTimeMinutes} min read
              </span>
            </div>

            <RichEditor value={content} onChange={setContent} />
          </div>

          {/* Section C: Featured Image */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <ImageIcon className="w-4 h-4 text-green-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                C. Featured Hero Image & Image SEO
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Preview Container */}
              <div className="md:col-span-5">
                <div className="aspect-[16/10] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative flex items-center justify-center shadow-inner">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt={imageAlt || "Preview"} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl("");
                          setImageAlt("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No hero image uploaded</span>
                    </div>
                  )}
                </div>

                {imageWidth && imageHeight && (
                  <div className="text-[11px] text-gray-500 text-center mt-1 font-mono">
                    Dimensions: {imageWidth} × {imageHeight} px
                  </div>
                )}
              </div>

              {/* Upload & Fields */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-semibold hover:bg-green-800 transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? "Uploading..." : imageUrl ? "Change Image" : "Upload Hero Image"}
                    </span>
                  </label>
                  <span className="text-[11px] text-gray-400 ml-3">or enter URL below</span>
                </div>

                <input
                  type="text"
                  placeholder="https://... or /uploads/blog/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                {/* Alt Text */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-700">
                      Featured Image Alt Text {!isDecorative && <span className="text-red-500">*</span>}
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDecorative}
                        onChange={(e) => setIsDecorative(e.target.checked)}
                        className="rounded text-green-700 focus:ring-green-600"
                      />
                      <span>Decorative</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    disabled={isDecorative}
                    required={!isDecorative && !!imageUrl}
                    placeholder="Describe what is actually shown in the image..."
                    value={isDecorative ? "" : imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
                  />

                  <div className="flex items-start gap-1.5 p-2 bg-green-50 rounded-lg text-[11px] text-green-800">
                    <Info className="w-3.5 h-3.5 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>Describe what is actually shown in the image. Do not keyword stuff.</span>
                  </div>
                </div>

                {/* Caption & Credit */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Caption</label>
                    <input
                      type="text"
                      placeholder="Optional image caption"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Image Credit</label>
                    <input
                      type="text"
                      placeholder="e.g. PurestStem Studio"
                      value={imageCredit}
                      onChange={(e) => setImageCredit(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: FAQ Section Builder */}
          <FaqBuilder faqs={faqs} onChange={setFaqs} />

          {/* Section E: Related Products Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Package className="w-4 h-4 text-green-700" />
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Related Products (eCommerce Integration)
                </h2>
                <p className="text-xs text-gray-500">
                  Select products to feature naturally at the end of this blog post.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allProducts.map((prod) => {
                const isSelected = selectedProductIds.includes(prod.id);
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedProductIds(selectedProductIds.filter((id) => id !== prod.id));
                      } else {
                        setSelectedProductIds([...selectedProductIds, prod.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50/80 ring-2 ring-green-600/30"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-900 truncate">{prod.name}</div>
                      <div className="text-[11px] text-green-700 font-medium">Rs. {prod.price.toLocaleString()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEO Panel, Health Score & Publishing (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* 1. Publishing Action Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Publishing & Status
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "scheduled" | "published")}
                className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="published">Published (Live)</option>
                <option value="draft">Draft (Private & Noindex)</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <label className="block text-xs font-semibold text-amber-900">
                  Publication Date & Time (PKT)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                />
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(status)}
                className="w-full py-2.5 bg-green-700 text-white hover:bg-green-800 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Saving..." : "Save & Update Post"}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit("draft")}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save as Draft
              </button>
            </div>
          </div>

          {/* 2. Real-time SEO Content Health */}
          <SeoHealthPanel analysis={seoAnalysis} />

          {/* 3. SEO Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              SEO Metadata & Keywords
            </h3>

            {/* Focus Keyword */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Focus Keyword</label>
              <input
                type="text"
                placeholder="e.g. herbal hair care tips"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Secondary Keywords */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Secondary Keywords
              </label>
              <div className="flex flex-wrap gap-1 p-1.5 border border-gray-300 rounded-xl min-h-[36px] bg-white items-center">
                {secondaryKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded"
                  >
                    {kw}
                    <button type="button" onClick={() => removeSecKeyword(kw)}>
                      <X className="w-2.5 h-2.5 text-gray-500" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add secondary keyword..."
                  value={secKwInput}
                  onChange={(e) => setSecKwInput(e.target.value)}
                  onKeyDown={addSecKeyword}
                  className="flex-1 min-w-[80px] text-xs outline-none bg-transparent"
                />
              </div>
            </div>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">SEO Title</label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    seoAnalysis.titleLength >= 50 && seoAnalysis.titleLength <= 60
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {seoAnalysis.titleLength} / 60 chars
                </span>
              </div>
              <input
                type="text"
                placeholder={title || "SEO Title shown on Google SERP..."}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Meta Description</label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    seoAnalysis.descLength >= 140 && seoAnalysis.descLength <= 160
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {seoAnalysis.descLength} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                placeholder={excerpt || "Compelling summary snippet displayed on Google Search..."}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Canonical URL */}
            <div className="pt-1">
              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1 cursor-pointer">
                <span>Canonical URL</span>
                <span className="text-[10px] text-green-700 font-normal">
                  {customCanonical ? "Manual override active" : "Auto: /blog/" + (slug || "...")}
                </span>
              </label>
              {customCanonical ? (
                <input
                  type="text"
                  placeholder="https://pureststem.com/blog/..."
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomCanonical(true)}
                  className="text-[11px] text-gray-500 hover:text-green-700 underline"
                >
                  Override Canonical URL manually
                </button>
              )}
            </div>

            {/* Robots Directives */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Index (robots)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Follow links</span>
              </label>
            </div>
          </div>

          {/* 4. Internal Link Suggestions */}
          <InternalLinksSuggest
            content={content}
            focusKeyword={focusKeyword}
            onInsertLink={handleInsertSuggestedLink}
          />

          {/* 5. Google Search SERP Preview */}
          <SerpPreview
            title={seoTitle || title}
            slug={slug}
            description={seoDescription || excerpt}
            canonicalUrl={customCanonical ? canonicalUrl : undefined}
          />

          {/* 6. Social Media Share Previews */}
          <SocialPreviews
            ogTitle={ogTitle || seoTitle || title}
            ogDescription={ogDescription || seoDescription || excerpt}
            ogImage={ogImage || imageUrl}
            twitterTitle={twitterTitle || ogTitle || seoTitle || title}
            twitterDescription={twitterDescription || ogDescription || seoDescription || excerpt}
            twitterImage={twitterImage || ogImage || imageUrl}
            slug={slug}
          />
        </div>
      </div>
    </div>
  );
}
