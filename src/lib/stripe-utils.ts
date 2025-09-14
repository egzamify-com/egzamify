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
  return await fetchMutation(
    api.payments.mutate.storeStripeCustomerId,
    { userId, customerId },
    {
      token: await convexAuthNextjsToken(),
    },
  );
}
export async function storeStripeCustomerData(
  customerId: string,
  customerData: string,
) {
  return await fetchMutation(
    api.payments.mutate.storeCustomerData,
    { customerId, customerData },
    {
      token: await convexAuthNextjsToken(),
    },
  );
}

export async function syncStripeDataToKV(customerId: string) {
  const subscriptions = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    const data = { status: "none" };
    await storeStripeCustomerData(customerId, JSON.stringify(data));
    // await kv.set(`stripe:customer:${customerId}`, subData);
    return data;
  }

  // If a user can have multiple subscriptions, that's your problem
  const subscription = subscriptions.data[0];

  // Store complete subscription state
  const subData = {
    subscriptionId: subscription.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodStart: subscription.current_period_start,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    paymentMethod:
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== "string"
        ? {
            brand: subscription.default_payment_method.card?.brand ?? null,
            last4: subscription.default_payment_method.card?.last4 ?? null,
          }
        : null,
  };

  // Store the data in your KV
  await kv.set(`stripe:customer:${customerId}`, subData);
  return subData;
}
