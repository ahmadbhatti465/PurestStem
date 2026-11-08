import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns | PurestStem Pakistan",
  description:
    "Delivery times, shipping charges, cash on delivery and the 7-day replacement guarantee for PurestStem orders across Pakistan.",
  alternates: { canonical: `${SITE_URL}/shop/shipping-returns` },
};

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Shipping & Returns" }]} title="Shipping & returns" />
      <Container className="max-w-3xl py-10 lg:py-16">
      <div className="prose enter">
        <h2 id="shipping">Shipping</h2>
        <ul>
          <li>Orders are shipped by express courier to every city in Pakistan.</li>
          <li>Major cities usually receive orders within 2 to 3 working days.</li>
          <li>Rural or remote areas typically take 3 to 4 working days.</li>
          <li>Shipping costs Rs 190, and is free on orders over Rs 5,000.</li>
          <li>Cash on delivery is available nationwide. You pay the rider when your package arrives.</li>
        </ul>

        <h2 id="returns">Returns &amp; refunds</h2>
        <p>
          We offer a 7-day replacement or return if your item arrives damaged, leaked or defective.
          WhatsApp our support team at 0333 4117668 with your order number and a photo of the item.
        </p>
        <p>
          Have another question? <Link href="/shop/contact">Contact us</Link> and we&apos;ll help.
        </p>
      </div>
    </Container>
    </>
  );
}
