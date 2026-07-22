export default function PromoBar() {
  return (
    <div className="bg-[#1a4a2e] text-white text-xs md:text-sm py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
        <span className="font-semibold tracking-wide">Cash on Delivery</span>
        <span className="hidden md:inline text-green-300">|</span>
        <span>Free Shipping over ₨ 5,000</span>
        <span className="hidden md:inline text-green-300">|</span>
        <span className="font-medium text-green-200">100% Herbal & Original</span>
      </div>
    </div>
  );
}
