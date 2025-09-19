import { waitUntil } from "@vercel/functions"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "~/actions/stripe/init-stripe"
import { env } from "~/env"
import { syncStripeDataToKV } from "~/lib/stripe-utils"
import { tryCatch } from "~/lib/tryCatch"
// ngrok http http://localhost:3000
export async function POST(req: Request) {
  console.log("[STRIPE] Webhook received!")
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature")
  if (!signature) return NextResponse.json({}, { status: 400 })

  console.dir({ body })
  async function doEventProcessing() {
    if (typeof signature !== "string") {
      throw new Error("[STRIPE HOOK] Header isn't a string???")
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    )

    waitUntil(processEvent(event))
  }

  const [_res, error] = await tryCatch(doEventProcessing())

  if (error) {
    console.error("[STRIPE HOOK] Error processing event", error)
  }

  return NextResponse.json({ received: true })
}
async function processEvent(event: Stripe.Event) {
  console.log("[STRIPE] Processing event")
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!allowedEvents.includes(event.type)) return

  // All the events I track have a customerId
  const { customer: customerId } = event?.data?.object as {
    customer: string // Sadly TypeScript does not know this
  }
  // console.dir({ event }, { depth: null })

  // This helps make it typesafe and also lets me know if my assumption is wrong
  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}`,
    )
  }

  const res = await syncStripeDataToKV(
    customerId,
    // @ts-expect-error afdsa
    event.data.object.metadata.mySessionId as string,
  )

  return res
}
const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "payment_intent.succeeded",
]
