"use client";

import { createStripeCheckout } from "~/actions/stripe/create-stripe-checkout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import useStripe from "~/hooks/use-stripe";

export default function PricingPage() {
  const stripePromise = useStripe();
  async function handleCheckout() {
    console.log("[STRIPE] Checkout handler started");
    const checkoutId = await createStripeCheckout();
    const stripe = await stripePromise();
    if (!stripe) {
      console.log("[STRIPE] Stripe on client not initialized");
      return;
    }
    // here before redirect, store in db amount of credits user attempts to buy, after success page renders,
    // update actual users credits, and clear the pending ones (prolly the cleanest and easiest way to know how much credits to add after
    // successful puchase)
    console.log("[STRIPE] storing pending credits");
    await stripe.redirectToCheckout({
      sessionId: checkoutId,
    });
  }
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1>pricing page</h1>
      <p>you can buy credits here</p>

      <Card>
        <CardHeader>
          <CardTitle>100 credits</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={async () => await handleCheckout()}>Buy now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
