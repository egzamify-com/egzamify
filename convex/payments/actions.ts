"use node" // 👈 THIS IS THE CRUCIAL FIX

import { validateEvent } from "@polar-sh/sdk/webhooks"
import type { Id } from "convex/_generated/dataModel"
import { v } from "convex/values"
import { internal } from "../_generated/api"
import { internalAction } from "../_generated/server"

export const handleWebhook = internalAction({
  args: {
    rawBody: v.string(),
    headersRecord: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const event = validateEvent(args.rawBody, args.headersRecord, args.secret)

    switch (event.type) {
      case "order.paid":
        console.log("order paid, add credits here")
        const creditsToAdd = parseInt(event.data?.product!.name.slice(0, 2))

        try {
          await ctx.runMutation(
            internal.users.mutate.updateUserCredits_WEBHOOK_ONLY,
            {
              creditsToAdd,
              userId: event.data.customer.externalId as Id<"users">,
            },
          )
          console.log("credist added succesfully - ", creditsToAdd, " credits")
        } catch (error) {
          console.error(
            "[POLAR] Error adding credits after payment!!! - ",
            error,
          )
          return new Response("[POLAR] Failed to add credits to user!!!", {
            status: 500,
          })
        }
        break

      default:
        console.log(`Unhandled Polar event type: ${event.type}`)
    }

    return { status: 200 }
  },
})
