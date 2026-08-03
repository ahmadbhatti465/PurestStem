import type { Metadata } from "next";
import { Check, Leaf, Shield, Truck, Award, Users } from "lucide-react";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

export const metadata: Metadata = {
  title: "About PurestStem | 60 Years of Trusted Herbal Products in Pakistan",
  description:
    "PurestStem has been crafting premium herbal products in Pakistan for over 60 years. Discover our story, mission, and commitment to 100% natural, lab-tested wellness products.",
  openGraph: {
    title: "About PurestStem | 60 Years of Trusted Herbal Products in Pakistan",
    description:
      "Discover the story behind Pakistan's trusted herbal brand. PurestStem combines ancient mountain wisdom with modern quality standards.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="pb-16">
      <PageSection background="light" padding="sm">
        <Breadcrumb items={[{ label: "About Us" }]} />
        <SectionHeader
          className="mt-6"
          eyebrow="Since 1964"
          eyebrowIcon={Award}
          title="About PurestStem"
          subtitle="Six decades of bringing the healing power of mountain herbs to every home across Pakistan"
        />
      </PageSection>

      <PageSection background="white" padding="md">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn direction="left" className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="/about_page.png"
                alt="PurestStem herbal products collection made in Pakistan"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-green-700 text-white rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-bold">60+</p>
              <p className="text-sm text-green-100">Years of Heritage</p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <SectionHeader
              align="left"
              title="Our Story"
              subtitle="From a small mountain apothecary to one of Pakistan's most trusted names in herbal wellness."
            />
            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
              <p>
                PurestStem began its journey over 60 years ago in the mountainous regions of Northern
                Pakistan, where our founder, Hakeem Abdul Rehman, discovered the remarkable healing
                properties of indigenous herbs growing at high altitudes. What started as a small
                apothecary serving local villages has grown into one of Pakistan&apos;s most trusted names
                in herbal wellness.
              </p>
              <p>
                Through three generations, we have preserved traditional formulations while embracing
                modern quality standards. Every PurestStem product is crafted with care, using
                ethically sourced herbs and ingredients that have been trusted by Pakistani families
                for generations.
              </p>
              <p className="text-green-800 font-medium bg-green-50 rounded-xl p-4 border border-green-100">
                Today, PurestStem delivers premium herbal shampoos, hair oils, herbal teas, soaps and
                skin care products across Pakistan — from Karachi to Peshawar — with cash on
                delivery and free shipping on orders over ₨ 5,000.
              </p>
            </div>
          </FadeIn>
        </div>
      </PageSection>

      <PageSection background="light">
        <SectionHeader
          title={<>
            Our Core{" "}
            <span className="text-green-700">Values</span>
          </>}
          subtitle="Everything we do is guided by a simple promise: nature first, purity always, customer forever."
        />

        <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              image: "/natural_herbs.jpg",
              icon: Leaf,
              title: "100% Natural",
              desc: "All products are made with pure, natural ingredients sourced from pristine mountain regions and trusted Pakistani farms. No harmful sulfates, parabens or artificial colors.",
            },
            {
              image: "/mortar_pestle.jpg",
              icon: Users,
              title: "Handcrafted with Care",
              desc: "Each product is prepared following traditional recipes passed down through three generations of herbalists. Small-batch production ensures freshness and potency.",
            },
            {
              image: "/lab_testing.jpg",
              icon: Shield,
              title: "Quality Assured",
              desc: "Every batch undergoes rigorous lab testing for purity, safety and effectiveness before reaching your doorstep. We believe trust is earned through transparency.",
            },
          ].map((item) => (
            <StaggerItem key={item.title}>
              <div className="group text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="aspect-[16/10] mb-4 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      <PageSection background="white">
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          <FadeIn direction="up" className="h-full">
            <div className="bg-[#132e1f] text-white rounded-3xl p-8 md:p-10 shadow-xl h-full flex flex-col justify-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-green-300" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="leading-relaxed text-green-100/90">
                To preserve and share the ancient wisdom of mountain herbalism while making premium
                natural wellness accessible to every Pakistani household. We believe in the power of
                nature to heal, nourish, and restore balance — without compromising on purity or
                safety.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.1} className="h-full">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm h-full">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-gray-900">Why Customers Trust Us</h2>
              <ul className="space-y-3">
                {[
                  "60+ years of herbal expertise in Pakistan",
                  "Cash on delivery across all major cities",
                  "Free shipping on orders over ₨ 5,000",
                  "100% natural and lab-tested ingredients",
                  "Thousands of verified customer reviews",
                  "Easy returns and friendly customer support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </PageSection>

      <PageSection background="light" padding="md">
        <FadeIn className="bg-green-700 rounded-3xl p-8 md:p-10 text-center text-white shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Pakistan-Wide Delivery</span>
          </div>
          <p className="text-green-100/90 max-w-2xl mx-auto">
            We deliver our herbal products to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar,
            Quetta, Multan, Faisalabad and every city across Pakistan. Order online and pay cash on
            delivery.
          </p>
        </FadeIn>
      </PageSection>
    </div>
  );
}
