"use server"

import { getStripeCustomerId, storeStripeCustomerId } from "~/lib/stripe-utils"
import { getNextjsUserOrThrow } from "../actions"
import { stripe } from "./init-stripe"

export async function createStripeCheckout(
  productPriceId: string,
  quantity: number,
) {
  console.log("[STRIPE] Creating new checkout")

  let stripeCustomerId = await getStripeCustomerId()

  if (!stripeCustomerId) {
    const user = await getNextjsUserOrThrow()
    console.warn(
      "[STRIPE] failed to get stripe customer, creating new customer for current user",
    )
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id, // DO NOT FORGET THIS
      },
    })
    console.log("[STRIPE] created new customer - ", newCustomer.id)
    await storeStripeCustomerId(user._id, newCustomer.id)
    stripeCustomerId = newCustomer.id
  }

  console.log(
    "[STRIPE] User already has a stripe customer id - ",
    stripeCustomerId,
  )
  const randomUUID = crypto.randomUUID()
  const checkout = await stripe.checkout.sessions.create({
    metadata: {
      mySessionId: randomUUID,
    },
    payment_intent_data: {
      metadata: {
        mySessionId: randomUUID,
      },
    },
    customer: stripeCustomerId,
    success_url: `http://localhost:3000/success?sessionId=${randomUUID}`,
    mode: "payment",
    line_items: [
      {
        price: JSON.parse(productPriceId) as string,
        quantity,
      },
    ],
  })

  console.log("[STRIPE] Created new checkout successfully - ", checkout.id)

  return checkout.id
}
