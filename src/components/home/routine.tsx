import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const STEPS = [
  {
    title: "Nourish the roots",
    product: "Hair Repairing Oil",
    timing: "30–60 minutes before washing, 2–3 times a week",
    body: "Warm a few drops between your palms and massage into the scalp for 5 minutes.",
  },
  {
    title: "Cleanse gently",
    product: "Herbal Shampoo",
    timing: "2–3 minute lather, every wash",
    body: "Lather into wet hair to lift buildup and excess oil without stripping natural moisture.",
  },
  {
    title: "Stay consistent",
    product: "The complete ritual",
    timing: "Give it 3 to 4 weeks",
    body: "Herbal care works gradually. Keep the routine going and let your scalp rebalance.",
  },
];

export function Routine() {
  return (
    <section className="cv-auto bg-green-50 py-16 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="The 3-step ritual"
          title="A simple routine for healthier hair"
          action={
            <Link href="/shop/products" className="btn btn-primary">
              Start your routine
            </Link>
          }
        />

        <div className="relative mt-12">
          <div className="draw-x absolute inset-x-0 top-0 hidden h-0.5 bg-green-700 md:block" aria-hidden="true" />
          <ol className="grid md:grid-cols-3 md:gap-10">
            {STEPS.map((step, index) => (
              <li key={step.title} className="reveal border-b border-line py-8 md:border-b-0" style={{ "--i": index * 3 } as CSSProperties}>
                <span className="font-display text-7xl leading-none text-green-300" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-display text-2xl text-green-950">{step.title}</h3>
                <p className="mt-1 text-sm font-medium text-green-800">{step.product}</p>
                <p className="mt-3 leading-relaxed text-gray-600">{step.body}</p>
                <p className="mt-4 text-sm text-gray-600">{step.timing}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
