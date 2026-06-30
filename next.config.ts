import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/problems/vendor-sprawl",
        destination: "/problems/restaurant-vendor-sprawl",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
