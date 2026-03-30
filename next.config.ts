import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev HMR when opening the app via LAN IP (e.g. phone on same Wi‑Fi), not only localhost.
  allowedDevOrigins: ["192.168.1.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orderfoodonline.deno.dev",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
