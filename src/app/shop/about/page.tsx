import type { Metadata } from "next";
import { Check, Leaf, Shield, Truck, Award, Users } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
          <Award className="w-4 h-4" />
          Since 1964
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About PurestStem
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Six decades of bringing the healing power of mountain herbs to every home across Pakistan
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <FadeIn direction="left">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img
              src="/about_page.png"
              alt="PurestStem herbal products collection made in Pakistan"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </FadeIn>
        <FadeIn direction="right" delay={0.15}>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              PurestStem began its journey over 60 years ago in the mountainous regions of Northern
              Pakistan, where our founder, Hakeem Abdul Rehman, discovered the remarkable healing
              properties of indigenous herbs growing at high altitudes. What started as a small
              apothecary serving local villages has grown into one of Pakistan&apos;s most trusted names
              in herbal wellness.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Through three generations, we have preserved traditional formulations while embracing
              modern quality standards. Every PurestStem product is crafted with care, using
              ethically sourced herbs and ingredients that have been trusted by Pakistani families
              for generations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, PurestStem delivers premium herbal shampoos, hair oils, herbal teas, soaps and
              skin care products across Pakistan — from Karachi to Peshawar — with cash on
              delivery and free shipping on orders over ₨ 5,000.
            </p>
          </div>
        </FadeIn>
      </div>

      <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-6 mb-16">
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 h-full">
            <img
              src="/natural_herbs.jpg"
              alt="100% natural herbs sourced from Pakistan mountains"
              className="w-full h-40 object-cover rounded-xl mb-4"
              loading="lazy"
            />
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">100% Natural</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All products are made with pure, natural ingredients sourced from pristine mountain
              regions and trusted Pakistani farms. No harmful sulfates, parabens or artificial
              colors.
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 h-full">
            <img
              src="/mortar_pestle.jpg"
              alt="Traditional herbal preparation with mortar and pestle"
              className="w-full h-40 object-cover rounded-xl mb-4"
              loading="lazy"
            />
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Handcrafted with Care</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each product is prepared following traditional recipes passed down through three
              generations of herbalists. Small-batch production ensures freshness and potency.
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 h-full">
            <img
              src="/lab_testing.jpg"
              alt="Quality lab testing of herbal products"
              className="w-full h-40 object-cover rounded-xl mb-4"
              loading="lazy"
            />
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Quality Assured</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every batch undergoes rigorous lab testing for purity, safety and effectiveness before
              reaching your doorstep. We believe trust is earned through transparency.
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <FadeIn direction="left">
          <div className="bg-green-800 text-white rounded-2xl p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="leading-relaxed text-green-100">
              To preserve and share the ancient wisdom of mountain herbalism while making premium
              natural wellness accessible to every Pakistani household. We believe in the power of
              nature to heal, nourish, and restore balance — without compromising on purity or
              safety.
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="right" delay={0.15}>
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-5 text-gray-900">Why Customers Trust Us</h2>
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

      <FadeIn className="bg-green-50 rounded-2xl p-8 text-center border border-green-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-green-700" />
          <span className="font-semibold text-gray-900">Pakistan-Wide Delivery</span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We deliver our herbal products to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar,
          Quetta, Multan, Faisalabad and every city across Pakistan. Order online and pay cash on
          delivery.
        </p>
      </FadeIn>
    </div>
  );
}
