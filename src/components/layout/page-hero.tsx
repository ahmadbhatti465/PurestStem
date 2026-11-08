import type { CSSProperties, ReactNode } from "react";
import { Leaf } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnimatedText } from "@/components/motion/animated-text";
import { Aurora, FallingLeaves } from "@/components/motion/aurora";

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  crumbs: { label: string; href?: string }[];
  accent?: string[];
  /** Shorter banner for pages where content should appear sooner. */
  compact?: boolean;
}

/** Animated dark banner that opens every storefront page. */
export function PageHero({ title, eyebrow, subtitle, crumbs, accent, compact = false }: PageHeroProps) {
  return (
    <section className={`relative isolate overflow-hidden bg-green-950 text-white ${compact ? "" : "min-h-[22rem]"}`}>
      <Aurora />
      <FallingLeaves />
      <div className="pointer-events-none absolute inset-y-0 right-[6%] hidden w-[24rem] lg:block" aria-hidden="true">
        <span className="hero-outline left-0 right-0 top-[8%]" />
        <span className="hero-outline left-12 right-12 top-[26%]" style={{ "--i": 1 } as CSSProperties} />
        <span className="hero-outline left-24 right-24 top-[44%]" style={{ "--i": 2 } as CSSProperties} />
        <Leaf className="bottle-float absolute bottom-[10%] left-1/2 h-16 w-16 -translate-x-1/2 text-green-200/70" strokeWidth={0.9} />
      </div>
      <Container className={compact ? "relative py-8 lg:py-10" : "relative py-10 lg:py-20"}>
        <Breadcrumb items={crumbs} light className="enter" />
        {eyebrow && (
          <p className={`eyebrow eyebrow-light enter ${compact ? "mt-4" : "mt-8"}`} style={{ "--i": 1 } as CSSProperties}>
            {eyebrow}
          </p>
        )}
        <h1 className={`mt-4 max-w-4xl ${compact ? "heading-lg" : "heading-xl"}`}>
          <AnimatedText text={title} accent={accent} />
        </h1>
        {subtitle && (
          <p className="enter mt-5 max-w-2xl text-base text-green-100/85 sm:text-lg" style={{ "--i": 4 } as CSSProperties}>
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
