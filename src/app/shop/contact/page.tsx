import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact PurestStem | Herbal Products Support in Pakistan",
  description:
    "Contact PurestStem for orders, shipping, returns, or product questions. Call 03334117668 or email pureststemofficial@gmail.com. We deliver herbal products across Pakistan.",
  alternates: {
    canonical: `${SITE_URL}/shop/contact`,
  },
  openGraph: {
    title: "Contact PurestStem | Herbal Products Support in Pakistan",
    description:
      "Get in touch with Pakistan's trusted herbal brand. Call, email or send us a message.",
    url: `${SITE_URL}/shop/contact`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Talk to us"
        title="We're here to help"
        accent={["help"]}
        subtitle="Questions about products, shipping or returns? We usually reply within 2–4 hours during business hours."
      />
      <Container className="py-10 lg:py-16">
      <JsonLd
        data={buildBreadcrumbSchema([{ label: "Home", href: "/" }, { label: "Contact Us" }], SITE_URL)}
      />
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <dl className="enter divide-y divide-line border-y border-line">
            <div className="py-4">
              <dt className="text-sm text-gray-600">Phone / WhatsApp</dt>
              <dd className="mt-0.5 font-display text-2xl text-green-950">
                <a href="tel:+923334117668" className="hover:text-green-800">0333 4117668</a>
              </dd>
              <dd className="mt-1 text-sm text-gray-600">Monday to Saturday, 9 AM to 7 PM</dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-gray-600">Email</dt>
              <dd className="mt-0.5 break-words text-lg text-green-950">
                <a href="mailto:pureststemofficial@gmail.com" className="hover:text-green-800">
                  pureststemofficial@gmail.com
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-gray-600">Head office</dt>
              <dd className="mt-0.5 text-lg text-green-950">Gulberg 3, Eden Tower, Lahore, Pakistan</dd>
            </div>
          </dl>
        </div>

        <div className="enter lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </Container>
    </>
  );
}
