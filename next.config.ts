import type { NextConfig } from "next";

/**
 * Fully static build: `npm run build` writes plain HTML/CSS/JS to `dist/`,
 * ready for any static host. Security headers live in `public/_headers`
 * (Netlify, Cloudflare Pages) and `public/.htaccess` (Apache), because a
 * static export can't set response headers itself.
 */
const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  // Emit `/about/index.html` instead of `/about.html` so every host serves clean URLs.
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
