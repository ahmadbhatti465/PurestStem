import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { AnimatedText } from "@/components/motion/animated-text";
import { Aurora } from "@/components/motion/aurora";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About PurestStem | 60 Years of Trusted Herbal Products in Pakistan",
  description:
    "PurestStem has been crafting premium herbal products in Pakistan for over 60 years. Discover our story, mission, and commitment to 100% natural, lab-tested wellness products.",
  alternates: {
    canonical: `${SITE_URL}/shop/about`,
  },
  openGraph: {
    title: "About PurestStem | 60 Years of Trusted Herbal Products in Pakistan",
    description:
      "Discover the story behind Pakistan's trusted herbal brand. PurestStem combines ancient mountain wisdom with modern quality standards.",
    url: `${SITE_URL}/shop/about`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const milestones = [
  {
    when: "1964",
    title: "A small mountain apothecary",
    body: "Our founder, Hakeem Abdul Rehman, discovers the healing properties of herbs growing at high altitude in Northern Pakistan and begins serving local villages.",
  },
  {
    when: "Three generations",
    title: "Recipes handed down",
    body: "Traditional formulations are preserved by each generation of herbalists, while modern quality standards are brought in.",
  },
  {
    when: "Today",
    title: "Delivered across Pakistan",
    body: "Herbal shampoos, hair oils and more reach homes from Karachi to Peshawar, with cash on delivery.",
  },
];

const values = [
  {
    image: "/natural_herbs.jpg",
    title: "100% natural",
    desc: "Pure ingredients from pristine mountain regions and trusted Pakistani farms. No harmful sulfates, parabens or artificial colors.",
  },
  {
    image: "/mortar_pestle.jpg",
    title: "Handcrafted with care",
    desc: "Traditional recipes passed down through three generations of herbalists. Small batches keep every product fresh and potent.",
  },
  {
    image: "/lab_testing.jpg",
    title: "Quality assured",
    desc: "Every batch is tested for purity, safety and effectiveness before it reaches your doorstep. Trust is earned through transparency.",
  },
];

const reasons = [
  "60+ years of herbal expertise in Pakistan",
  "Cash on delivery across all major cities",
  "Free shipping on orders over Rs 5,000",
  "100% natural and lab-tested ingredients",
  "Easy returns and friendly customer support",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ label: "Home", href: "/" }, { label: "About Us" }], SITE_URL)} />

      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="Since 1964"
        title="Six decades of mountain herbalism"
        accent={["mountain", "herbalism"]}
        subtitle="From a small apothecary serving local villages to one of Pakistan's most trusted names in herbal wellness."
      />

      <section className="bg-green-50 py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal-wipe relative aspect-[4/3] overflow-hidden rounded-3xl bg-green-200 lg:sticky lg:top-28 lg:self-start">
            <Image
              src="/about_page.png"
              alt="PurestStem herbal products collection made in Pakistan"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="parallax-img object-cover"
            />
          </div>

          <div>
            <p className="eyebrow">Our journey</p>
            <ol className="relative mt-8 space-y-12 pl-8">
              <span className="draw-y absolute bottom-2 left-[5px] top-2 w-0.5 bg-green-700" aria-hidden="true" />
              {milestones.map((item) => (
                <li key={item.title} className="reveal relative">
                  <span className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-green-800 ring-4 ring-green-100" aria-hidden="true" />
                  <p className="text-sm font-medium text-green-800">{item.when}</p>
                  <h2 className="mt-1 font-display text-3xl text-green-950">{item.title}</h2>
                  <p className="mt-2 leading-relaxed text-gray-700">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <p className="eyebrow">What guides us</p>
          <h2 className="heading-lg mt-4 max-w-2xl text-green-950">
            <AnimatedText mode="scroll" text="Nature first, purity always" />
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {values.map((item, index) => (
              <div key={item.title} className="reveal" style={{ "--i": index * 3 } as CSSProperties}>
                <div className="arch relative aspect-[4/5] overflow-hidden bg-green-100">
                  <Image src={item.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="parallax-img object-cover" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-green-950">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-green-900 py-16 text-white lg:py-24">
        <Aurora />
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <p className="eyebrow eyebrow-light">Our mission</p>
            <p className="mt-5 font-display text-2xl leading-snug sm:text-4xl">
              To preserve the ancient wisdom of mountain herbalism while making natural wellness
              accessible to every Pakistani household.
            </p>
          </div>
          <div className="reveal">
            <h2 className="font-display text-2xl">Why customers trust us</h2>
            <ul className="mt-5 space-y-3">
              {reasons.map((item) => (
                <li key={item} className="flex items-start gap-3 text-green-100">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-green-200" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/shop/products" className="btn btn-light mt-8">
              Shop the range <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
