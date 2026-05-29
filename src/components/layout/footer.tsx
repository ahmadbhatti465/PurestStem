import Link from "next/link";
import { Leaf, Phone, Mail, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <StaggerItem>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xl font-bold">Khan Herbals</span>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">
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
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span>info@khanherbals.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Mountain View Road, Abbottabad, Pakistan</span>
                </li>
              </ul>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="border-t border-green-800 mt-10 pt-6 text-center text-sm text-green-300">
            <p>© 2026 Khan Herbals. All rights reserved.</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
