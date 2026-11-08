import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  { href: "/shop/products", label: "All products" },
  { href: "/blog", label: "Blog" },
  { href: "/shop/about", label: "About us" },
];

const helpLinks = [
  { href: "/shop/contact", label: "Contact us" },
  { href: "/shop/shipping-returns#shipping", label: "Shipping" },
  { href: "/shop/shipping-returns#returns", label: "Returns & refunds" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-green-100/80 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="max-w-md font-display text-3xl leading-tight text-white sm:text-4xl">
              60 years of mountain herbalism, delivered across Pakistan.
            </p>
            <div className="mt-6 max-w-sm">
              <h2 className="mb-3 text-sm font-medium text-green-100/90">
                Herbal tips, new arrivals and offers
              </h2>
              <NewsletterForm variant="dark" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Help" links={helpLinks} />
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-sm font-semibold text-white">Reach us</h2>
              <address className="mt-4 space-y-3 text-sm not-italic text-green-100/80">
                <a href="tel:+923334117668" className="block transition-colors hover:text-white">
                  0333 4117668
                </a>
                <a
                  href="mailto:pureststemofficial@gmail.com"
                  className="block break-words transition-colors hover:text-white"
                >
                  pureststemofficial@gmail.com
                </a>
                <p>Gulberg 3, Eden Tower, Lahore</p>
              </address>
            </div>
          </div>
        </div>

        <p className="reveal mt-14 select-none text-center font-display text-[15.5vw] leading-none text-white/10 xl:text-[12.5rem]" aria-hidden="true">
          PurestStem
        </p>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/15 pt-8 text-sm text-green-100/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="rounded-lg bg-white px-2 py-1">
              <Image src="/pureststem_logo.png" alt="PurestStem" width={1082} height={380} sizes="96px" className="h-8 w-auto" />
            </span>
            <p>© {new Date().getFullYear()} PurestStem</p>
          </div>
          <div className="flex gap-5">
            <a
              href="https://instagram.com/pureststem"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/pureststem"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
