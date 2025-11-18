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
}

export default config
