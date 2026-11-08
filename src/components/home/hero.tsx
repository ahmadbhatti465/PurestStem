import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Banknote, Leaf, MessageCircle, RotateCcw, Truck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AnimatedText } from "@/components/motion/animated-text";
import { Aurora, FallingLeaves } from "@/components/motion/aurora";
import { MouseParallax } from "@/components/motion/mouse-parallax";
import { formatPrice } from "@/lib/utils";

const WHATSAPP_ORDER_URL =
  "https://wa.me/923334117668?text=Hello%20PurestStem%2C%20I%20want%20to%20order%20herbal%20products%20with%20Cash%20on%20Delivery";

// Each bottle keeps its place from the original group photo, so together they
// line up as one composition while moving independently.
const BOTTLES = [
  { src: "/hero/oil.webp", alt: "PurestStem Hair Repairing Oil", w: 241, h: 805, left: "3.3%", top: "19%", width: "25.8%", depth: "26px", dur: "7.5s", delay: "-1s", order: 1 },
  { src: "/hero/repair.webp", alt: "PurestStem Hair Repairing Shampoo", w: 269, h: 977, left: "33.6%", top: "2.4%", width: "28.8%", depth: "12px", dur: "6.5s", delay: "0s", order: 0, preload: true },
  { src: "/hero/herbal.webp", alt: "PurestStem Herbal Shampoo", w: 286, h: 977, left: "66.8%", top: "2.4%", width: "30.6%", depth: "20px", dur: "8.5s", delay: "-3s", order: 2 },
];

const VALUES = [
  { icon: Banknote, title: "Cash on delivery", note: "All cities in Pakistan" },
  { icon: Truck, title: "Free shipping", note: "On orders over Rs 5,000" },
  { icon: RotateCcw, title: "7-day replacement", note: "If damaged or defective" },
  { icon: Leaf, title: "Zero sulfates", note: "Or parabens and silicones" },
];

export function Hero({ startingPrice }: { startingPrice?: number }) {
  return (
    <section className="relative isolate overflow-hidden bg-green-950 text-white">
      <Aurora />
      <FallingLeaves />

      <Container className="relative grid items-center gap-10 pb-10 pt-10 sm:pt-14 lg:min-h-[calc(100svh-13rem)] lg:grid-cols-12 lg:gap-6 lg:pb-14 lg:pt-10">
        <div className="lg:col-span-7">
          <p className="eyebrow eyebrow-light enter">Est. 1964 · Himalayan herbal care</p>
          <h1 className="hero-title mt-5">
            <AnimatedText
              text="Natural hair regrowth, backed by 60 years of heritage."
              accent={["regrowth,", "heritage."]}
            />
          </h1>
          <p className="enter mt-6 max-w-xl text-base leading-relaxed text-green-100/85 sm:text-lg" style={{ "--i": 7 } as CSSProperties}>
            Cold-macerated formulas with wildcrafted Amla, Bhringraj, Rosemary and Coconut to calm
            hair fall and dandruff. No sulfates, no parabens, no artificial perfume.
          </p>

          <div className="enter mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--i": 9 } as CSSProperties}>
            <Link href="/shop/products" className="btn btn-light">
              Shop herbal products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border-white/35 text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Order on WhatsApp
            </a>
          </div>
        </div>

        <MouseParallax className="hero-sink hero-stage relative mx-auto aspect-[934/1024] w-full max-w-[26rem] sm:max-w-[32rem] lg:col-span-5 lg:ml-auto lg:mr-0">
          <div className="arch hero-arch absolute inset-x-[1%] bottom-0 top-[13%]" aria-hidden="true" />

          {BOTTLES.map((bottle) => (
            <div
              key={bottle.src}
              className="absolute"
              style={{ left: bottle.left, top: bottle.top, width: bottle.width }}
            >
              <div className="bottle-mouse" style={{ "--depth": bottle.depth } as CSSProperties}>
                <div className="bottle-rise" style={{ "--i": bottle.order } as CSSProperties}>
                  <div className="bottle-float" style={{ "--dur": bottle.dur, "--delay": bottle.delay } as CSSProperties}>
                    <Image
                      src={bottle.src}
                      alt={bottle.alt}
                      width={bottle.w}
                      height={bottle.h}
                      preload={bottle.preload}
                      sizes="(min-width: 640px) 170px, 30vw"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="enter absolute -left-[3%] -top-[1%] aspect-square w-[24%]" style={{ "--i": 10 } as CSSProperties} aria-hidden="true">
            <svg viewBox="0 0 100 100" className="spin-slow h-full w-full text-green-200">
              <defs>
                <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="10.5" fill="currentColor" letterSpacing="1.6">
                <textPath href="#badge-circle">SINCE 1964 · 100% BOTANICAL · </textPath>
              </text>
            </svg>
            <Leaf className="absolute inset-0 m-auto h-[26%] w-[26%] text-green-200" strokeWidth={1.25} />
          </div>

          {startingPrice !== undefined && (
            <p className="enter absolute bottom-5 left-0 rounded-2xl bg-white px-4 py-3 text-sm text-gray-700 shadow-xl sm:-left-4" style={{ "--i": 12 } as CSSProperties}>
              From <span className="font-semibold text-green-950">{formatPrice(startingPrice)}</span>
              <span className="block text-xs text-gray-600">Pay on delivery</span>
            </p>
          )}
        </MouseParallax>
      </Container>

      <div className="relative border-t border-white/15">
        <Container className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, note }, index) => (
            <div key={title} className="enter flex items-start gap-3" style={{ "--i": index + 11 } as CSSProperties}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-200" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-green-100/80 sm:text-sm">{note}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}
