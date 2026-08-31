import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@react-pdf/renderer", "bwip-js", "qrcode"],
};

export default nextConfig;
