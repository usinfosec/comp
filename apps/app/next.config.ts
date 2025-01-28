import "./src/env.mjs";

const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["@bubba/ui"],
  logging: {
    fetches: {
      fullUrl: process.env.LOG_FETCHES === "true",
    },
  },
};

export default config;
