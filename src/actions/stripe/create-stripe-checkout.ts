"use server";

import { getStripeCustomerId, storeStripeCustomerId } from "~/lib/stripe-utils";
import { getNextjsUserOrThrow } from "../actions";
import { stripe } from "./init-stripe";

export async function createStripeCheckout() {
  console.log("[STRIPE] Creating new checkout");

  const user = await getNextjsUserOrThrow();

  let stripeCustomerId = await getStripeCustomerId(user._id);

  if (!stripeCustomerId) {
    console.log(
      "[STRIPE] failed to get stripe customer, creating new customer for current user",
    );
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id, // DO NOT FORGET THIS
      },
    });
    console.log("[STRIPE] created new customer - ", newCustomer.id);
    await storeStripeCustomerId(user._id, newCustomer.id);
    stripeCustomerId = newCustomer.id;
  }

  console.log(
    "[STRIPE] User already has a stripe customer id - ",
    stripeCustomerId,
  );

  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    success_url: "http://localhost:3000/success",
    mode: "payment",
    line_items: [
      {
        price: "price_1S7Jnx9CIXS1fKXQ6Utfxd7v",
        quantity: 1,
      },
    ],
  });

  console.log("[STRIPE] Created new checkout successfully - ", checkout.id);

  return checkout.id;
}
