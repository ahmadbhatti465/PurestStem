import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import SiteChrome from "@/components/layout/site-chrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PurestStem - Premium Herbal Products",
  description: "60 Years of Mountain Herbalism. Premium herbal shampoos, oils, teas and skincare products delivered across Pakistan.",
  icons: {
    icon: "/pureststem_logo.png",
    apple: "/pureststem_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
