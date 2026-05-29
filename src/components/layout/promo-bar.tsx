export default function PromoBar() {
  return (
    <div className="bg-green-800 text-white text-xs md:text-sm py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 md:gap-6">
        <span>Cash on Delivery Available</span>
        <span className="hidden md:inline">|</span>
        <span>Free Shipping on Orders Over ₨ 5,000</span>
        <span className="hidden md:inline">|</span>
        <span>100% Herbal & Original</span>
      </div>
    </div>
  );
}
