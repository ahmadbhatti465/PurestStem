import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact PurestStem | Herbal Products Support in Pakistan",
  description:
    "Contact PurestStem for orders, shipping, returns, or product questions. Call 03334117668 or email pureststemofficial@gmail.com. We deliver herbal products across Pakistan.",
  openGraph: {
    title: "Contact PurestStem | Herbal Products Support in Pakistan",
    description:
      "Get in touch with Pakistan's trusted herbal brand. Call, email or send us a message.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Have questions about our herbal products, shipping, or returns? We are here to help. Reach
          out to our team and we will get back to you within 24 hours.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12">
        <StaggerContainer staggerDelay={0.12} className="space-y-6">
          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone / WhatsApp</h3>
                <p className="text-gray-600">03334117668</p>
                <p className="text-sm text-gray-500 mt-1">Available Monday to Saturday, 9 AM to 7 PM</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">pureststemofficial@gmail.com</p>
                <p className="text-sm text-gray-500 mt-1">We reply to all emails within 24 hours</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Head Office</h3>
                <p className="text-gray-600">Gulberg 3, Eden Tower</p>
                <p className="text-gray-600">Lahore, Punjab, Pakistan</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Response Time</h3>
                <p className="text-gray-600">Usually within 2-4 hours during business hours</p>
                <p className="text-sm text-gray-500 mt-1">Cash on delivery available across Pakistan</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <ContactForm />
      </div>
    </div>
  );
}
