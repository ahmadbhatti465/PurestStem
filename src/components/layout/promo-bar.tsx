export default function PromoBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1a4a2e] via-[#2d6a4f] to-[#1a4a2e] text-white text-xs md:text-sm py-2.5 px-4 text-center">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent)]" />
      <div className="relative max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
        <span className="font-semibold tracking-wide">Cash on Delivery</span>
        <span className="hidden md:inline text-green-300">|</span>
        <span>Free Shipping over ₨ 5,000</span>
        <span className="hidden md:inline text-green-300">|</span>
        <span className="font-medium text-[#c8e8a8]">100% Herbal & Original</span>
      </div>
    </div>
  );
}
