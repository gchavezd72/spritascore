import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/en/software-risk-score",
        destination: "/en/executive-software-risk-score",
        permanent: true,
      },
      {
        source: "/calculadora/executive-software-risk-score",
        destination: "/en/executive-software-risk-score",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
