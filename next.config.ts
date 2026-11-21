import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 2678400, // 31 days — uploads use unique file names
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer", "bwip-js", "qrcode"],
  poweredByHeader: false,
  async headers() {
    // A partial CSP: these directives block clickjacking, <base>/<object>
    // injection and form hijacking without needing nonces for Next.js's
    // inline scripts. A full script-src policy would need per-request nonces.
    const csp = [
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
    ].join("; ");
    const common = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: common },
      // Admin pages and APIs must never be cached by shared caches.
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
};

export default nextConfig;
