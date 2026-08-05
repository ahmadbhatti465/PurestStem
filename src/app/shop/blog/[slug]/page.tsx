import Link from "next/link";
import { ArrowLeft, Calendar, User, Sparkles, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { parseFaq, readingTime } from "@/lib/blog-content";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShareButtons } from "@/components/share-buttons";
import JsonLd from "@/components/json-ld";
import { FadeIn } from "@/components/animations/fade-in";
import type { Metadata } from "next";

async function getBlogPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
  });
}

/** Render inline markdown: **bold** and [text](url) links. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[2]) {
      nodes.push(
        <strong key={key++} className="font-semibold text-gray-900">
          {match[2]}
        </strong>
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={match[5]}
          className="text-green-700 font-medium underline underline-offset-4 hover:text-green-800"
        >
          {match[4]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
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

  const pageUrl = `${SITE_URL}/shop/blog/${post.slug}`;

  return {
    title: `${post.title} | PurestStem Blog`,
    description: post.excerpt || undefined,
    keywords: [
      post.title,
      post.excerpt || "",
      "herbal Pakistan",
      "natural remedies Pakistan",
      "PurestStem blog",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      url: pageUrl,
      siteName: SITE_NAME,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: post.image
        ? [{ url: absoluteUrl(post.image), alt: post.title }]
        : [{ url: `${SITE_URL}/hero-section.png`, alt: "PurestStem herbal blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.image ? [absoluteUrl(post.image)] : [`${SITE_URL}/hero-section.png`],
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
  const pageUrl = `${SITE_URL}/shop/blog/${post.slug}`;
  const faqItems = parseFaq(post.content);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.image ? absoluteUrl(post.image) : `${SITE_URL}/hero-section.png`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/pureststem_logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="pb-16">
      <JsonLd data={blogSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

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
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime(post.content)} min read</span>
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
                    {renderInline(paragraph.replace("## ", ""))}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                const lines = paragraph.split("\n");
                return (
                  <div key={i}>
                    <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-900">
                      {renderInline(lines[0].replace("### ", ""))}
                    </h3>
                    {lines.length > 1 && (
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {renderInline(lines.slice(1).join(" "))}
                      </p>
                    )}
                  </div>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{renderInline(item.replace("- ", ""))}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{renderInline(item.replace(/^\d+\.\s/, ""))}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-gray-700 mb-6 leading-relaxed">
                  {renderInline(paragraph)}
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
