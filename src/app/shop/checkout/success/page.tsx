import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-700" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your order. We have received it and will process it shortly.
        You will receive a confirmation call soon.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop/products"
          className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
