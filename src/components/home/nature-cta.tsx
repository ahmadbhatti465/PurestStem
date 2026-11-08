import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Aurora, FallingLeaves } from "@/components/motion/aurora";

const LINES = ["Nature.", "Purity.", "You."];

export function NatureCta() {
  return (
    <section className="cv-auto relative isolate overflow-hidden bg-green-950 py-20 text-white lg:py-32">
      <Aurora />
      <FallingLeaves />
      <Container className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-display text-[clamp(4rem,14vw,12rem)] leading-[0.98] tracking-tight">
          {LINES.map((line) => (
            <span key={line} className="fill-line block w-fit pr-[0.08em]">
              {line}
            </span>
          ))}
        </h2>
        <div className="reveal max-w-sm lg:pb-6">
          <p className="text-lg text-green-100/85">Start your herbal routine today. Pay only when it reaches your door.</p>
          <Link href="/shop/products" className="btn btn-light mt-6">
            Shop the range <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
