import Link from "next/link";
import { CheckCircle, ArrowRight, Home, Package } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

export default function CheckoutSuccessPage() {
  return (
    <div className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a2e] via-[#2d6a4f] to-[#1a4a2e]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-600/20 rounded-full blur-[100px]" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <FadeIn direction="up" duration={0.6}>
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-300" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Order Placed!
          </h1>
          <p className="text-green-100/80 mb-2 text-lg">
            Thank you for your order.
          </p>
          <p className="text-green-200/60 mb-10 max-w-md mx-auto">
            We have received it and will process it shortly. You will receive a confirmation call soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-900 px-8 py-3.5 rounded-full font-semibold hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
            >
              <Package className="w-5 h-5" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
