import { Webhooks } from "@polar-sh/nextjs"
import { env } from "~/env"

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,

  onPayload: async (payload) => {
    switch (payload.type) {
      case "checkout.created":
        console.log("Checkout created")
        break

      case "checkout.updated":
        console.log("Checkout updated")
        break

      case "order.paid":
        console.log("order paid, add credits here")
        break

      default:
        console.log(`Unhandled event type ${payload.type}`)
    }
  },
})
