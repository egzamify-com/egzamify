import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { stripe } from "~/actions/stripe/init-stripe";

export async function getStripeCustomerId(userId: Id<"users">) {
  return await fetchQuery(
    api.payments.query.getStripeCustomerId,
    { userId },
    {
      token: await convexAuthNextjsToken(),
    },
  );
}
export async function storeStripeCustomerId(
  userId: Id<"users">,
  customerId: string,
) {
  console.log("[STRIPE] Storing stripe customer id started");
  const result = await fetchMutation(
    api.payments.mutate.storeStripeCustomerId,
    { userId, customerId },
    {
      token: await convexAuthNextjsToken(),
    },
  );
  console.log("[STRIPE] Storing stripe customer id completed");
  return result;
}
export async function storeStripeCustomerData(
  customerId: string,
  customerData: string,
) {
  console.log("[STRIPE] Storing stripe customer data started");
  const result = await fetchMutation(
    api.payments.mutate.storeCustomerData,
    { customerId, customerData },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  console.log("[STRIPE] Storing stripe customer data completed");
  return result;
}

export async function syncStripeDataToKV(customerId: string) {
  console.log("[STRIPE] Stripe data to kv sync started");
  const payment = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 1,
  });

  if (payment.data.length === 0) {
    const data = { status: "none" };
    await storeStripeCustomerData(customerId, JSON.stringify(data));
    console.log(
      "[STRIPE] No payment data found, inserted empty, placeholder data",
    );
    return data;
  }

  const paymentData = payment.data[0];
  await storeStripeCustomerData(customerId, JSON.stringify(paymentData));

  console.log("[STRIPE] Stripe data to kv sync completed");
  return paymentData;
}
