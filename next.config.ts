import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly specify Turbopack root directory to resolve warning
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
