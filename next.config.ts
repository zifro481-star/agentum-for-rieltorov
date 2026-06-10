import type { NextConfig } from "next";

const manyashaApiOrigin = process.env.MANYASHA_API_PROXY_TARGET ?? "http://127.0.0.1:8001";
const manyashaWidgetOrigin =
  process.env.MANYASHA_WIDGET_PROXY_TARGET ?? "http://127.0.0.1:5173";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/manyasha-api/:path*",
        destination: `${manyashaApiOrigin}/:path*`,
      },
      {
        source: "/manyasha-widget/:path*",
        destination: `${manyashaWidgetOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
