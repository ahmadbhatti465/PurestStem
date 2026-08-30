import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/admin/delete-button";
import {
  Plus,
  Pencil,
  ImageIcon,
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Globe,
  Lock,
  Calendar,
  Sparkles,
  Layers,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { analyzeBlogSeo } from "@/lib/seo-analyzer";

async function getPosts() {
  return await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter = "all", q } = await searchParams;
  const allPosts = await getPosts();

  // Compute SEO analysis for each post
  const analyzedPosts = allPosts.map((post) => {
    let parsedFaqs = [];
    if (post.faqs) {
      try {
        parsedFaqs = typeof post.faqs === "string" ? JSON.parse(post.faqs) : post.faqs;
      } catch {}
    }

    const analysis = analyzeBlogSeo({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      seoTitle: post.seoTitle || undefined,
      seoDescription: post.seoDescription || undefined,
      focusKeyword: post.focusKeyword || undefined,
      featuredImage: post.image || undefined,
      featuredImageAlt: post.imageAlt || undefined,
      canonicalUrl: post.canonicalUrl || undefined,
      robotsIndex: post.robotsIndex,
      robotsFollow: post.robotsFollow,
      faqs: parsedFaqs,
      author: post.author,
      categoryId: post.categoryId || undefined,
    });

    return {
      ...post,
      analysis,
    };
  });

  // Calculate Metrics
  const totalCount = analyzedPosts.length;
  const publishedCount = analyzedPosts.filter((p) => p.status === "published" || (p.published && !p.status)).length;
  const draftCount = analyzedPosts.filter((p) => p.status === "draft" || (!p.published && p.status !== "scheduled")).length;
  const scheduledCount = analyzedPosts.filter((p) => p.status === "scheduled").length;
  const missingAltCount = analyzedPosts.filter((p) => p.analysis.missingAltCount > 0).length;
  const lowSeoCount = analyzedPosts.filter((p) => p.analysis.healthScore < 70).length;

  // Filter posts
  const filteredPosts = analyzedPosts.filter((p) => {
    if (q) {
      const qLower = q.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(qLower);
      const matchSlug = p.slug.toLowerCase().includes(qLower);
      const matchKw = p.focusKeyword?.toLowerCase().includes(qLower);
      if (!matchTitle && !matchSlug && !matchKw) return false;
    }

    if (filter === "published") return p.status === "published" || (p.published && !p.status);
    if (filter === "draft") return p.status === "draft" || (!p.published && p.status !== "scheduled");
    if (filter === "scheduled") return p.status === "scheduled";
    if (filter === "missing-seo") return !p.seoTitle || !p.seoDescription || !p.focusKeyword;
    if (filter === "missing-alt") return p.analysis.missingAltCount > 0;
    if (filter === "low-health") return p.analysis.healthScore < 70;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SEO Blog Audit Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage articles, technical SEO health scores, indexability, and Google Search rankings.
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </Link>
        </div>
      </FadeIn>

      {/* Overview Metrics Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/blog"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "all" ? "border-green-600 bg-green-50/50 ring-2 ring-green-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Posts</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</div>
          </Link>

          <Link
            href="/admin/blog?filter=published"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "published" ? "border-green-600 bg-green-50/50 ring-2 ring-green-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">Published (Live)</div>
            <div className="text-2xl font-bold text-green-800 mt-1">{publishedCount}</div>
          </Link>

          <Link
            href="/admin/blog?filter=draft"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "draft" ? "border-green-600 bg-green-50/50 ring-2 ring-green-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Drafts</div>
            <div className="text-2xl font-bold text-gray-700 mt-1">{draftCount}</div>
          </Link>

          <Link
            href="/admin/blog?filter=scheduled"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "scheduled" ? "border-green-600 bg-green-50/50 ring-2 ring-green-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Scheduled</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{scheduledCount}</div>
          </Link>

          <Link
            href="/admin/blog?filter=missing-alt"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "missing-alt" ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Missing Alt Text</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{missingAltCount}</div>
          </Link>

          <Link
            href="/admin/blog?filter=low-health"
            className={`p-4 rounded-2xl border transition-all ${
              filter === "low-health" ? "border-red-600 bg-red-50/50 ring-2 ring-red-600/20" : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Low SEO Health</div>
            <div className="text-2xl font-bold text-red-700 mt-1">{lowSeoCount}</div>
          </Link>
        </div>
      </FadeIn>

      {/* Main Table Card */}
      <FadeIn delay={0.15}>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Table Header Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Link
                href="/admin/blog"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "all" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                All Posts ({totalCount})
              </Link>
              <Link
                href="/admin/blog?filter=published"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "published" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                Published ({publishedCount})
              </Link>
              <Link
                href="/admin/blog?filter=draft"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "draft" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                Drafts ({draftCount})
              </Link>
              <Link
                href="/admin/blog?filter=scheduled"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "scheduled" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                Scheduled ({scheduledCount})
              </Link>
              <Link
                href="/admin/blog?filter=missing-seo"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "missing-seo" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                Missing SEO Metadata
              </Link>
              <Link
                href="/admin/blog?filter=missing-alt"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === "missing-alt" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                Missing Alt Text ({missingAltCount})
              </Link>
            </div>
          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Article</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase">Status & Index</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase">Focus Keyword</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase">Content Depth</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase">Image Alt</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase text-center">SEO Health</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase">Updated</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No blog articles found matching the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const isPub = post.status === "published" || (post.published && !post.status);
                    const isSched = post.status === "scheduled";
                    const isDraft = !isPub && !isSched;

                    const score = post.analysis.healthScore;
                    let scoreBadge = "bg-green-100 text-green-800 border-green-200";
                    if (score < 60) scoreBadge = "bg-red-100 text-red-800 border-red-200";
                    else if (score < 80) scoreBadge = "bg-amber-100 text-amber-800 border-amber-200";

                    return (
                      <tr key={post.id} className="hover:bg-green-50/40 transition-colors">
                        {/* Article Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                              {post.image ? (
                                <img
                                  src={post.image}
                                  alt={post.imageAlt || post.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <div className="font-semibold text-gray-900 truncate" title={post.title}>
                                {post.title}
                              </div>
                              <div className="text-[11px] text-gray-400 font-mono truncate">
                                /blog/{post.slug}
                              </div>
                              {post.category && (
                                <span className="inline-block mt-0.5 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                                  {post.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status & Indexability */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                                isPub
                                  ? "bg-green-100 text-green-700"
                                  : isSched
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {isPub ? "Published" : isSched ? "Scheduled" : "Draft"}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              {post.robotsIndex && isPub ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <Globe className="w-3 h-3" /> Indexable
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Lock className="w-3 h-3" /> Noindex
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Focus Keyword */}
                        <td className="px-4 py-4">
                          {post.focusKeyword ? (
                            <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-[11px]">
                              {post.focusKeyword}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">Not defined</span>
                          )}
                        </td>

                        {/* Content Depth */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5 text-gray-600">
                            <div>{post.analysis.wordCount} words</div>
                            <div className="text-[10px] text-gray-400">
                              {post.analysis.internalLinksCount} internal link(s)
                            </div>
                          </div>
                        </td>

                        {/* Image Alt */}
                        <td className="px-4 py-4">
                          {post.analysis.missingAltCount === 0 ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-[11px] font-medium">
                              <CheckCircle className="w-3.5 h-3.5" /> All Alt Set
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 text-[11px] font-medium">
                              <AlertTriangle className="w-3.5 h-3.5" /> Missing ({post.analysis.missingAltCount})
                            </span>
                          )}
                        </td>

                        {/* SEO Health */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full border text-xs ${scoreBadge}`}
                          >
                            {score}/100
                          </span>
                        </td>

                        {/* Updated Date */}
                        <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(post.updatedAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              title="View Article Live"
                              className="p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              title="Edit Article & SEO"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <DeleteButton
                              apiUrl={`/api/admin/blog/${post.id}`}
                              redirectPath="/admin/blog"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
