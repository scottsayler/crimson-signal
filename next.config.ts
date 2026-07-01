import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/problems/internet-outages",
        destination: "/problems/restaurant-internet-outages",
        permanent: true,
      },
      {
        source: "/problems/network-visibility",
        destination: "/problems/restaurant-network-visibility",
        permanent: true,
      },
      {
        source: "/problems/vendor-sprawl",
        destination: "/problems/restaurant-vendor-sprawl",
        permanent: true,
      },
      {
        source: "/restaurants/vendor-sprawl",
        destination: "/problems/restaurant-vendor-sprawl",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
