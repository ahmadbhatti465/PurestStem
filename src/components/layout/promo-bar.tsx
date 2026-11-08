export default function PromoBar() {
  return (
    <div className="bg-green-950 px-4 py-2 text-center text-xs tracking-wide text-green-100">
      Cash on delivery
      <span className="mx-2 text-green-400" aria-hidden="true">
        ·
      </span>
      Free shipping over Rs 5,000
    </div>
  );
}
