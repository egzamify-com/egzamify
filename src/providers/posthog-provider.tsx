"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"
import { env } from "~/env"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const isDevHost =
    typeof window !== "undefined" && window.location.host !== "egzamify.com"
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      defaults: "2025-05-24",
    })
  }, [])

  if (isDevHost) {
    console.log("posthog dev env")
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}
