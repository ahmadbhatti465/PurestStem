import type { CSSProperties } from "react";
import { Check, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Aurora } from "@/components/motion/aurora";

const COMPARISONS = [
  {
    feature: "Extraction",
    ordinary: "High-heat factory processing",
    purest: "45-day cold maceration in stone and copper",
  },
  {
    feature: "Cleansers",
    ordinary: "Harsh SLS and SLES that strip the scalp",
    purest: "Sulfate-free coconut and soapnut cleansers",
  },
  {
    feature: "Shine",
    ordinary: "Silicones and mineral oils that coat the hair",
    purest: "Cold-pressed Amla, Bhringraj, Rosemary and Almond",
  },
  {
    feature: "Origin",
    ordinary: "Mass-made with artificial fragrance",
    purest: "A family herbal tradition since 1964",
  },
];

export function Difference() {
  return (
    <section className="cv-auto relative isolate overflow-hidden bg-green-900 py-16 text-white lg:py-28">
      <Aurora />
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeader light eyebrow="The pure difference" title="Why Pakistani families trust PurestStem" />
        </div>

        <div className="lg:col-span-8">
          <table className="w-full border-collapse text-left text-sm sm:text-base">
            <caption className="sr-only">PurestStem compared with ordinary commercial haircare</caption>
            <thead>
              <tr className="border-b border-white/25">
                <td className="hidden pb-4 sm:table-cell" />
                <th scope="col" className="pb-4 pr-4 font-medium text-green-100/80">Ordinary haircare</th>
                <th scope="col" className="pb-4 font-semibold text-white">PurestStem</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, index) => (
                <tr key={row.feature} className="reveal border-b border-white/15 align-top" style={{ "--i": index * 2 } as CSSProperties}>
                  <th scope="row" className="hidden py-6 pr-4 font-display text-xl font-normal text-green-200 sm:table-cell">
                    {row.feature}
                  </th>
                  <td className="py-6 pr-4 text-green-100/75">
                    <span className="flex gap-2.5">
                      <X className="mt-1 h-4 w-4 shrink-0 text-green-100/50" aria-hidden="true" />
                      {row.ordinary}
                    </span>
                  </td>
                  <td className="py-6 font-medium text-white">
                    <span className="flex gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-green-200" strokeWidth={3} aria-hidden="true" />
                      {row.purest}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
