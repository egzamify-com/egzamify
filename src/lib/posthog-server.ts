import type { Doc } from "convex/_generated/dataModel"
import { PostHogClient } from "~/actions/posthog"
import { APP_CONFIG } from "~/APP_CONFIG"

export async function captureAitMessage(
  properties: Omit<typeof APP_CONFIG.phEvents.aiChat.aiChatMessage, "name">,
  user: Doc<"users">,
) {
  const posthog = PostHogClient()
  posthog.capture({
    event: APP_CONFIG.phEvents.aiChat.aiChatMessage.name,
    distinctId: user._id,
    properties: { ...properties, email: user.email, name: user.name },
  })
  await posthog.shutdown()
}
