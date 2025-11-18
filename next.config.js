/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js"

/** @type {import("next").NextConfig} */
const config = {
  // api: {
  //   bodyParser: false,
  // },
  reactStrictMode: false,
  typedRoutes: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "formal-jay-146.convex.site",
      },
      { protocol: "https", hostname: "precise-bobcat-903.convex.site" },
    ],
  },
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
