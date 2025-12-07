/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js"

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  typedRoutes: true,
  serverExternalPackages: ["pdf-parse"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "formal-jay-146.convex.site",
      },
      { protocol: "https", hostname: "precise-bobcat-903.convex.site" },
      { protocol: "https", hostname: "confident-aardvark-526.convex.site" },
    ],
  },
  // posthog proxy
  async rewrites() {
    return [
      {
        source: "/relay-HCT4/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/relay-HCT4/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default config
