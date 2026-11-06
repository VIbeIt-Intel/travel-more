import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/travel-more" : "";
const dev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  ...(githubPages
    ? {
        output: "export",
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
      }
    : {}),
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: githubPages,
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  ...(githubPages
    ? {}
    : {
        async headers() {
          return [
            { source: "/:path*", headers: securityHeaders },
            { source: "/office", headers: [{ key: "Cache-Control", value: "no-store" }] },
            { source: "/office/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
          ];
        },
      }),
};

export default nextConfig;
