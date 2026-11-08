import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SmartImage } from "@/components/ui/smart-image";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  imageAlt: string | null;
}

export function Journal({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="cv-auto bg-green-100/60 py-16 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="From the blog"
          title="Ancient wisdom, modern wellness"
          action={
            <Link href="/blog" className="link-arrow">
              Read all articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <article key={post.id} className="reveal group" style={{ "--i": index * 3 } as CSSProperties}>
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="img-zoom relative aspect-[3/2] overflow-hidden rounded-2xl bg-green-200">
                  <SmartImage
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug text-green-950 group-hover:text-green-800">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
