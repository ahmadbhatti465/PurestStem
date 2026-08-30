import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  AlertTriangle,
  HelpCircle,
  Share2,
  Package,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { readingTime } from "@/lib/blog-content";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft Preview Mode | PurestStem Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminBlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  let faqs = [];
  if (post.faqs) {
    try {
      faqs = typeof post.faqs === "string" ? JSON.parse(post.faqs) : post.faqs;
    } catch {}
  }

  const tagsList = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const readTime = readingTime(post.content);
  const displayDate = post.publishedAt || post.createdAt;

  return (
    <div className="pb-20">
      {/* Draft Preview Protected Banner */}
      <div className="bg-amber-500 text-amber-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-950 flex-shrink-0" />
          <span>
            Admin Preview Mode: This article ({post.status}) is private, protected by your admin session, and blocked from search engines (noindex).
          </span>
        </div>
        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="inline-flex items-center gap-1 bg-amber-950 text-white px-3 py-1 rounded-lg text-xs hover:bg-black transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Back to Editor
        </Link>
      </div>

      {/* Article View */}
      <article className="min-h-screen">
        <section className="relative bg-gradient-to-b from-[#0f2419] to-[#173826] text-white pt-12 pb-16">
          <Container className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  ...(post.category ? [{ label: post.category.name }] : []),
                  { label: post.title },
                ]}
                className="text-white/70"
              />
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center text-green-300 font-bold text-sm">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white">{post.author}</div>
                  <div className="text-[11px] text-white/60">
                    {post.authorBio || "PurestStem Herbal Health Research"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-green-400" />
                  {new Date(displayDate).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-green-400" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </Container>
        </section>

        {post.image && (
          <Container className="max-w-4xl mx-auto -mt-8 relative z-10">
            <figure className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
              <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {(post.imageCaption || post.imageCredit) && (
                <figcaption className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
                  <span>{post.imageCaption}</span>
                  {post.imageCredit && (
                    <span className="text-[11px] text-gray-400 italic">Photo: {post.imageCredit}</span>
                  )}
                </figcaption>
              )}
            </figure>
          </Container>
        )}

        <Container className="max-w-4xl mx-auto py-12">
          <div
            className="prose prose-lg prose-green max-w-none text-gray-800 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(post.content),
            }}
          />

          {tagsList.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">Tags:</span>
              {tagsList.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {faqs.length > 0 && (
            <section className="mt-16 bg-green-50/60 rounded-3xl p-8 border border-green-200/60 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p className="text-xs text-gray-600">Expert answers to common wellness questions</p>
                </div>
              </div>

              <div className="space-y-4">
                {faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-green-100 shadow-sm space-y-2"
                  >
                    <h3 className="text-base font-bold text-gray-900">{faq.question}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center text-green-800 font-bold text-2xl flex-shrink-0">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-bold text-gray-900 text-base">{post.author}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3 text-green-700" /> Verified Author
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {post.authorBio ||
                  "PurestStem Herbal Health Research Team specializes in chemical-free botanical formulations, desi skincare secrets, and holistic organic hair care remedies in Pakistan."}
              </p>
            </div>
          </section>
        </Container>
      </article>
    </div>
  );
}
