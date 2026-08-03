import Link from "next/link";
import { ArrowLeft, Calendar, User, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShareButtons } from "@/components/share-buttons";
import { FadeIn } from "@/components/animations/fade-in";
import type { Metadata } from "next";

async function getBlogPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | PurestStem Blog",
    };
  }

  return {
    title: `${post.title} | PurestStem Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `/shop/blog/${post.slug}`;

  return (
    <div className="pb-16">
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-800 to-[#132e1f]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <Container className="absolute bottom-0 left-0 right-0 pb-10">
          <FadeIn direction="up" className="max-w-4xl">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/shop/blog" },
                { label: post.title },
              ]}
              className="text-white/70 mb-4"
            />
            <Link
              href="/shop/blog"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </FadeIn>
        </Container>
      </section>

      <Container className="py-12">
        <FadeIn className="max-w-4xl mx-auto">
          {/*  Author + meta row  */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">Herbal Wellness Expert</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/*  Article body  */}
          <article className="prose prose-lg prose-green max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">{post.excerpt}</p>
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl md:text-3xl font-bold mt-12 mb-5 text-gray-900">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-900">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-gray-700 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/*  Share  */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Written by</p>
                <p className="font-semibold text-gray-900">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Share article:</span>
              <ShareButtons url={shareUrl} text={post.title} size="sm" />
            </div>
          </div>

          {/*  Back CTA  */}
          <div className="mt-12">
            <Link
              href="/shop/blog"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Explore More Articles
            </Link>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
