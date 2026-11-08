import { Marquee } from "@/components/motion/marquee";

const INGREDIENTS = ["Amla", "Bhringraj", "Rosemary", "Neem", "Aloe Vera", "Chamomile", "Coconut", "Soapnut", "Argan", "Onion Seed"];

export function IngredientRibbon() {
  return (
    <div className="overflow-hidden bg-green-50 py-6" aria-label="Key ingredients">
      <div className="-mx-4 -rotate-1 bg-green-200 py-4">
        <Marquee duration={38}>
          {INGREDIENTS.map((name) => (
            <span key={name} className="flex items-center gap-10 whitespace-nowrap font-display text-3xl text-green-950 sm:text-4xl">
              {name}
              <span className="text-xl text-green-700" aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
