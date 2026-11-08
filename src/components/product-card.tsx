import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";
import { QuickAddButton } from "@/components/quick-add-button";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string | null;
    images?: string | null;
    stock?: number;
    weight?: string | null;
    category: { name: string };
  };
  /** Set on cards visible without scrolling. */
  preload?: boolean;
}

export default function ProductCard({ product, preload = false }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.salePrice);
  const primaryImage = getPrimaryImage(product.image, product.images);
  const productSlug = slugify(product.slug || product.name);
  const productUrl = `/shop/products/${encodeURIComponent(productSlug)}`;
  const price = product.salePrice || product.price;
  const soldOut = product.stock !== undefined && product.stock <= 0;

  return (
    <article className="product-card flex h-full flex-col">
      <Link
        href={productUrl}
        aria-label={product.name}
        className="surface product-frame relative block aspect-[4/5] overflow-hidden"
      >
        <SmartImage
          src={primaryImage}
          alt=""
          fill
          preload={preload}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="relative object-contain p-3 sm:p-5"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-green-900 px-2.5 py-1 text-xs font-semibold text-white">
            Save {discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-medium text-green-800">{product.category.name}</p>
        <h3
          className="mt-1 font-display text-base font-medium leading-snug text-green-950 sm:text-lg"
        >
          <Link href={productUrl} className="line-clamp-2 hover:text-green-800">
            {product.name}
          </Link>
        </h3>

        <p className="mb-3 mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-gray-900">{formatPrice(price)}</span>
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
          )}
        </p>

        <div className="mt-auto">
          <QuickAddButton
            productId={product.id}
            name={product.name}
            slug={productSlug}
            price={price}
            image={primaryImage || undefined}
            soldOut={soldOut}
          />
        </div>
      </div>
    </article>
  );
}
