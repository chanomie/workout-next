import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "workout-next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
  basePath: isProd ? `/${repoName}` : "",
});

export default withPWA(nextConfig);
