import { getStripeCustomerId, storeStripeCustomerId } from "~/lib/stripe-utils";
import { getNextjsUserOrThrow } from "../actions";
import { stripe } from "./init-stripe";

export async function createStripeCheckout() {
  const user = await getNextjsUserOrThrow();

  let stripeCustomerId = await getStripeCustomerId(user._id);

  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id, // DO NOT FORGET THIS
      },
    });

    await storeStripeCustomerId(user._id, newCustomer.id);
    stripeCustomerId = newCustomer.id;
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    success_url: "http://localhost:3000/succes",
  });
}
