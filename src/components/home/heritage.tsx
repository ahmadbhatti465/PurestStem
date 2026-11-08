import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AnimatedText } from "@/components/motion/animated-text";
import { CountUp } from "@/components/motion/count-up";

const FACTS = [
  { value: "1964", label: "The year it began" },
  { value: "3", label: "Generations of herbalists" },
  { value: "50,000+", label: "Customers across Pakistan" },
];

export function Heritage() {
  return (
    <section className="cv-auto relative isolate overflow-hidden bg-green-100/60 py-16 lg:py-28">
      <p className="drift pointer-events-none absolute -right-6 top-6 -z-10 select-none font-display text-[26vw] leading-none text-green-200/40" aria-hidden="true">
        1964
      </p>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="reveal-wipe relative aspect-[4/3] overflow-hidden rounded-3xl bg-green-200">
          <Image
            src="/about_page.png"
            alt="Traditional PurestStem mountain herb preparation in Pakistan"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="parallax-img object-cover"
          />
        </div>

        <div>
          <p className="eyebrow">Our heritage</p>
          <h2 className="heading-lg mt-4 text-green-950">
            <AnimatedText mode="scroll" text="Ancient mountain wisdom. Zero synthetic shortcuts." accent={["Zero"]} accentClassName="text-green-700" />
          </h2>
          <p className="reveal mt-5 text-base leading-relaxed text-gray-700 sm:text-lg">
            PurestStem began in the high valleys of Pakistan with a simple belief: nature provides
            what healthy hair and skin need. For six decades we have refused petroleum waxes,
            synthetic foaming detergents and artificial dyes.
          </p>

          <dl className="reveal mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dd className="font-display text-2xl text-green-900 sm:text-5xl">
                  <CountUp value={fact.value} />
                </dd>
                <dt className="mt-1 text-xs text-gray-600 sm:text-sm">{fact.label}</dt>
              </div>
            ))}
          </dl>

          <Link href="/shop/about" className="link-arrow mt-6">
            Read our story <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
