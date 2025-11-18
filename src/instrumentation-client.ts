import posthog from "posthog-js"
import { env } from "~/env"

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: "/relay-HCT4",
  ui_host: "https://eu.posthog.com",
})
