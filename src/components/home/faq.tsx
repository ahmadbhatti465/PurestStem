import { Plus } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const FAQS = [
  {
    q: "How long does shipping take across Pakistan?",
    a: "Major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) usually receive orders within 2 to 3 working days. Rural or remote areas typically take 3 to 4 working days.",
  },
  {
    q: "How do I use PurestStem Hair Repairing Oil for best results?",
    a: "Apply 1 to 2 tablespoons to a dry scalp and lengths 30 to 60 minutes before bathing, or leave overnight for intensive care. Massage gently for 5 minutes and wash off with PurestStem Herbal Shampoo. Use 2 to 3 times a week.",
  },
  {
    q: "Are PurestStem products free from parabens, sulfates and silicones?",
    a: "Yes. We avoid SLS, SLES, parabens, synthetic silicones, artificial colorants and mineral oils.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Yes, in all cities and towns of Pakistan. You pay the rider when your package arrives.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day replacement or return if your item arrives damaged, leaked or defective. WhatsApp our support team with your order number and a photo.",
  },
];

export function Faq() {
  return (
    <section className="cv-auto bg-green-50 py-16 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader eyebrow="Questions" title="Good to know" />
        </div>
        <div className="lg:col-span-8">
          {FAQS.map((faq, index) => (
            <details key={faq.q} name="home-faq" open={index === 0} className="group reveal border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg text-green-950 sm:text-xl [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-green-800 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
