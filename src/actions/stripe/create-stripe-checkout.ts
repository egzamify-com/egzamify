"use server"

import type Stripe from "stripe"
import { getStripeCustomerId, storeStripeCustomerId } from "~/lib/stripe-utils"
import { getNextjsUserOrThrow } from "../actions"
import { stripe } from "./init-stripe"

export async function createStripeCheckout(
  product: Stripe.Product,
  // productPriceId: string,
  quantity: number,
) {
  console.log("[STRIPE] Creating new checkout")

  const productPriceId = product.default_price
  if (!productPriceId) {
    console.error(
      "[STRIPE] Product doesnt have a price (?), product id - ",
      product.id,
    )
    throw new Error("[STRIPE] Product doesnt have a price (?), product id - ")
  }

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
  const checkoutMetadata = {
    mySessionId: randomUUID,
    creditsPurchased: quantity * parseInt(product.name),
  }
  const checkout = await stripe.checkout.sessions.create({
    metadata: { ...checkoutMetadata },
    payment_intent_data: {
      metadata: { ...checkoutMetadata },
    },
    customer: stripeCustomerId,
    success_url: `http://localhost:3000/success?sessionId=${randomUUID}`,
    mode: "payment",
    line_items: [
      {
        price: JSON.stringify(productPriceId),
        quantity,
      },
    ],
  })

  console.log("[STRIPE] Created new checkout successfully")
  console.log("[STRIPE] Our random checkout id - ", randomUUID)
  console.log("[STRIPE] Officical stripe checkout id - ", checkout.id)

  return checkout.id
}
