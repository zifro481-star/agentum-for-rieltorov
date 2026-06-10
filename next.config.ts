import type { NextConfig } from "next";
import { CSP_HEADER, SECURITY_HEADERS } from "./src/lib/security/headers";

const manyashaApiOrigin = process.env.MANYASHA_API_PROXY_TARGET ?? "http://127.0.0.1:8001";
const manyashaWidgetOrigin =
  process.env.MANYASHA_WIDGET_PROXY_TARGET ?? "http://127.0.0.1:5173";

const securityHeaders = Object.entries({
  ...SECURITY_HEADERS,
  "Content-Security-Policy": CSP_HEADER,
}).map(([key, value]) => ({ key, value }));

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
