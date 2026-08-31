import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { FadeIn } from "@/components/animations/fade-in";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import type { Metadata } from "next";
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

const contactCards = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    lines: ["03334117668"],
    note: "Available Monday to Saturday, 9 AM to 7 PM",
    highlighted: false,
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["pureststemofficial@gmail.com"],
    note: "We reply to all emails within 24 hours",
    highlighted: false,
  },
  {
    icon: MapPin,
    title: "Head Office",
    lines: ["Gulberg 3, Eden Tower", "Lahore, Punjab, Pakistan"],
    note: null,
    highlighted: false,
  },
  {
    icon: Clock,
    title: "Response Time",
    lines: ["Usually within 2-4 hours during business hours"],
    note: "Cash on delivery available across Pakistan",
    highlighted: true,
  },
];

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { label: "Home", href: "/" },
      { label: "Contact Us" },
    ],
    SITE_URL
  );

  return (
    <div className="pb-16">
      <JsonLd data={breadcrumbSchema} />
      <PageSection background="light" padding="sm">
        <Breadcrumb items={[{ label: "Contact Us" }]} />
        <SectionHeader
          titleAs="h1"
          className="mt-6"
          title="Contact Us"
          subtitle="Have questions about our herbal products, shipping, or returns? We are here to help. Reach out and we'll get back to you within 24 hours."
        />
      </PageSection>

      <PageSection background="white" padding="md">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          <StaggerContainer staggerDelay={0.12} className="space-y-5">
            {contactCards.map((card) => (
              <StaggerItem key={card.title}>
                <div
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-sm ${
                    card.highlighted
                      ? "bg-green-50 border-green-100"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="w-12 h-12 min-w-[48px] bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <card.icon className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    {card.lines.map((line) => (
                      <p key={line} className="text-gray-700 mt-0.5">
                        {line}
                      </p>
                    ))}
                    {card.note && (
                      <p className="text-sm text-gray-500 mt-2">{card.note}</p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn direction="right" delay={0.2}>
            <ContactForm />
          </FadeIn>
        </div>
      </PageSection>
    </div>
  );
}
