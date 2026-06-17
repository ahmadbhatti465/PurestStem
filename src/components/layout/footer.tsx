import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1a4a2e] via-[#2d6a4f] to-[#1a4a2e] text-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <StaggerItem>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded-xl px-3 py-2 shadow-lg shadow-black/20">
                  <img
                    src="/pureststem_logo.png"
                    alt="PurestStem"
                    className="h-10 w-auto"
                  />
                </div>
              </div>
              <p className="text-green-100/80 text-sm leading-relaxed">
                60 Years of Mountain Herbalism — Delivered Across Pakistan.
                Premium herbal products crafted with ancient wisdom and modern purity.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/shop/products" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/shop/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/shop/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h3 className="font-semibold text-white mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/shop/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Return & Refund</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>03334117668</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span>pureststemofficial@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Gluberg 3, Eden Tower Lahore Pakistan</span>
                </li>
              </ul>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-green-100/70">
            <p>© 2026 PurestStem. All rights reserved.</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
