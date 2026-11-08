import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import MetaPixel from "@/components/meta-pixel";
import { Providers } from "@/components/providers";
import SiteChrome from "@/components/layout/site-chrome";
import PromoBar from "@/components/layout/promo-bar";
import Footer from "@/components/layout/footer";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";
import "./motion.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const display = Playfair_Display({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page title already includes the brand, so no template is applied.
  title: `${SITE_NAME} | Premium Herbal Products in Pakistan - 100% Natural`,
  description:
    "Pakistan's trusted herbal brand since 1964. Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products. Cash on delivery across Pakistan. Free shipping over ₨ 5,000.",
  keywords: [
    "herbal products Pakistan",
    "herbal shampoo Pakistan",
    "hair growth oil Pakistan",
    "natural skincare Pakistan",
    "herbal tea Pakistan",
    "organic shampoo Pakistan",
    "amla reetha shikakai shampoo",
    "neem soap Pakistan",
    "ubtan powder Pakistan",
    "PurestStem",
  ],
  authors: [{ name: "PurestStem" }],
  creator: "PurestStem",
  publisher: "PurestStem",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "PurestStem",
    title: `${SITE_NAME} | Premium Herbal Products in Pakistan`,
    description:
      "Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products in Pakistan. Cash on delivery available.",
    images: [
      {
        url: `${SITE_URL}/hero-section.png`,
        width: 934,
        height: 1024,
        alt: "PurestStem herbal products collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Herbal Products in Pakistan`,
    description:
      "100% natural herbal shampoos, hair oils, herbal teas and skincare delivered across Pakistan.",
    images: [`${SITE_URL}/hero-section.png`],
  },
  icons: {
    icon: "/icon.jpeg",
    apple: "/icon.jpeg",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} antialiased`}>
      <head>
        <MetaPixel />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteChrome promoBar={<PromoBar />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
