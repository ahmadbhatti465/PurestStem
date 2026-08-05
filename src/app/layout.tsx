import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import SiteChrome from "@/components/layout/site-chrome";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Herbal Products in Pakistan - 100% Natural`,
    template: `%s | ${SITE_NAME}`,
  },
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
        width: 1200,
        height: 630,
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
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1663005645391963');
        fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1663005645391963&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
