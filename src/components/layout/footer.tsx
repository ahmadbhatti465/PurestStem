import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#132e1f] text-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-xl px-3 py-2 shadow-lg">
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

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop/products" className="hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/shop/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Return & Refund</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

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
            <div className="flex gap-3 mt-5">
              {[
                { name: "Instagram", path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 2.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" },
                { name: "Facebook", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c4.56-.93 8-4.96 8-9.95" },
              ].map((social) => (
                <Link
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-green-100/70">
          <p>© 2026 PurestStem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
