"use server"

import type Stripe from "stripe"
import { env } from "~/env"
import { getStripeCustomerId, storeStripeCustomerId } from "~/lib/stripe-utils"
import { getNextjsUserOrThrow } from "../actions"
import { stripe } from "./init-stripe"

export async function createStripeCheckout(
  product: Stripe.Product,
  quantity: number,
) {
  const user = await getNextjsUserOrThrow()
  console.log("[STRIPE] Started reating new checkout for - ", user._id)

  const productPriceId = product.default_price
  if (!productPriceId) {
    const errMess = "[STRIPE] Product doesnt have a price (?), product id - "
    console.error(errMess, product.id)
    throw new Error(errMess)
  }

  let stripeCustomerId = await getStripeCustomerId()

  if (!stripeCustomerId) {
    console.warn(
      "[STRIPE] Failed to get stripe customer, creating new customer for current signed in user",
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
    success_url: `${env.NEXT_PUBLIC_BASE_SERVER_URL}/success?sessionId=${randomUUID}`,
    mode: "payment",
    line_items: [
      {
        price: productPriceId as string,
        quantity,
      },
    ],
  })

  console.log(
    "[STRIPE] Created new checkout successfully, stripe checkout id - ",
    checkout.id,
    " random session id - ",
    randomUUID,
  )

  return checkout.id
}
