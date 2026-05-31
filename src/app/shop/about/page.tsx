import { Leaf, Heart, Mountain, Award } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About PurestStem</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Six decades of bringing the healing power of mountain herbs to your doorstep
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <FadeIn direction="left">
          <div className="aspect-video bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
            <Mountain className="w-32 h-32 text-green-700" />
          </div>
        </FadeIn>
        <FadeIn direction="right" delay={0.15}>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              PurestStem began its journey over 60 years ago in the mountainous regions of Pakistan,
              where our founder, Hakeem Khan, discovered the remarkable healing properties of indigenous
              herbs growing at high altitudes.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              What started as a small apothecary serving local communities has grown into Pakistan&apos;s
              most trusted name in herbal wellness. Through three generations, we have maintained our
              commitment to traditional formulations while embracing modern quality standards.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, PurestStem delivers premium herbal products across Pakistan, bringing the
              wisdom of mountain herbalism to urban homes.
            </p>
          </div>
        </FadeIn>
      </div>

      <StaggerContainer
        staggerDelay={0.15}
        className="grid md:grid-cols-3 gap-8 mb-16"
      >
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-md transition-shadow duration-300 h-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">100% Natural</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All our products are made with pure, natural ingredients sourced from pristine mountain regions.
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-md transition-shadow duration-300 h-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Made with Care</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each product is crafted following traditional recipes passed down through generations.
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-md transition-shadow duration-300 h-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Quality Assured</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Rigorous testing ensures every product meets our high standards of purity and effectiveness.
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn>
        <div className="bg-green-800 text-white rounded-xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="max-w-2xl mx-auto leading-relaxed">
            To preserve and share the ancient wisdom of mountain herbalism while making premium
            natural wellness accessible to every Pakistani household. We believe in the power of
            nature to heal, nourish, and restore balance.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
