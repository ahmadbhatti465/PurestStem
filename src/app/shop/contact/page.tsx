import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions? We would love to hear from you. Reach out to our team.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12">
        <StaggerContainer staggerDelay={0.12} className="space-y-6">
          <StaggerItem>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+92 300 1234567</p>
                <p className="text-gray-600">+92 51 1234567</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">info@pureststem.com</p>
                <p className="text-gray-600">support@pureststem.com</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">Mountain View Road</p>
                <p className="text-gray-600">Abbottabad, KPK, Pakistan</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
                <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn direction="right" delay={0.2}>
          <div className="bg-green-50 p-6 md:p-8 rounded-xl border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2.5 rounded-md font-medium hover:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
