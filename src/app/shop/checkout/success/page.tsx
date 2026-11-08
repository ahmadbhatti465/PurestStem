import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { CheckoutSteps } from "@/components/checkout-steps";
import { AnimatedText } from "@/components/motion/animated-text";
import { Aurora, FallingLeaves } from "@/components/motion/aurora";

export default function CheckoutSuccessPage() {
  return (
    <section className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-green-950 px-4 py-16 text-center text-white">
      <Aurora />
      <FallingLeaves />
      <CheckCircle className="check-pop h-14 w-14 text-green-200" strokeWidth={1.25} aria-hidden="true" />
      <h1 className="heading-lg mt-6"><AnimatedText text="Thank you, your order is placed" /></h1>
      <p className="mt-4 max-w-md text-green-100/85">
        We&apos;ll call you to confirm within 24 hours and dispatch in 1–3 business days. Have the
        cash ready when your rider arrives.
      </p>
      <p className="mt-2 text-sm text-green-100/85">Need help? WhatsApp us at 0333 4117668.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop/products" className="btn btn-light">
          Continue shopping
        </Link>
        <Link href="/" className="btn border-white/40 text-white hover:bg-white/10">
          Back to home
        </Link>
      </div>
      <div className="mt-10 rounded-full bg-white px-5 py-2">
        <CheckoutSteps currentStep={3} />
      </div>
    </section>
  );
}
