import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.appledb.dev",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
