import type { CSSProperties } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const STEPS = [
  {
    title: "Harvested in the mountains",
    body: "Herbs are hand-gathered in the Himalayan foothills of Pakistan, where clean water and mineral-rich soil grow potent plants.",
    image: "/natural_herbs.jpg",
    alt: "Fresh mountain herbs and botanicals",
  },
  {
    title: "Cold-infused for 45 days",
    body: "Instead of heat that damages delicate plant compounds, we infuse slowly in traditional stone and copper vessels.",
    image: "/mortar_pestle.jpg",
    alt: "Herbs being ground in a stone mortar and pestle",
  },
  {
    title: "Tested batch by batch",
    body: "Ancient knowledge, checked with modern care. Each batch is tested for purity and safety before it reaches you.",
    image: "/lab_testing.jpg",
    alt: "Herbal formula being tested in a laboratory",
  },
];

/** Pins and slides sideways on large screens; a normal stacked list elsewhere. */
export function Craft() {
  return (
    <section className="h-scroll bg-white py-16 lg:py-0">
      <div className="h-scroll-sticky">
        <ol className="h-scroll-track grid gap-10 px-4 sm:px-6 md:grid-cols-3 md:gap-8 lg:px-8">
          <li className="h-scroll-intro md:col-span-3">
            <SectionHeader eyebrow="How we make it" title="Made slowly, the way it has always been" />
            <p className="mt-4 max-w-md text-gray-600">Three unhurried steps, unchanged in spirit since 1964.</p>
          </li>
          {STEPS.map((step, index) => (
            <li key={step.title} className="h-scroll-panel">
              <div className="arch relative aspect-[4/5] overflow-hidden bg-green-100">
                <Image src={step.image} alt={step.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 768px) 33vw, 100vw" className="parallax-img object-cover" />
              </div>
              <div className="reveal" style={{ "--i": 1 } as CSSProperties}>
                <p className="mt-5 font-display text-sm text-green-800">Step {index + 1}</p>
                <h3 className="mt-1 font-display text-2xl text-green-950">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
