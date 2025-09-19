"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type Stripe from "stripe"
import { createStripeCheckout } from "~/actions/stripe/create-stripe-checkout"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import useStripe from "~/hooks/use-stripe"
import { tryCatch } from "~/lib/tryCatch"

export default function Product({ product }: { product: Stripe.Product }) {
  const [quantity, setQuantity] = useState(1)
  const updateUserPendingCredits = useMutation(
    api.payments.mutate.updatePendingCredits,
  )
  const stripePromise = useStripe()
  async function handleCheckout() {
    console.log("[STRIPE] Checkout handler started")

    const [checkoutId, checkoutIdErr] = await tryCatch(
      createStripeCheckout(product, quantity),
    )
    if (checkoutIdErr) {
      console.error("[STRIPE] Error creating checkout session", checkoutIdErr)
      toast.error("Failed to create checkout session, please try again")
      return
    }
    const stripe = await stripePromise()
    if (!stripe) {
      console.error("[STRIPE] Stripe on client not initialized")
      toast.error("Failed to create checkout session, please try again")
      return
    }

    const [res, err] = await tryCatch(
      updateUserPendingCredits({
        pendingCreditsToAdd: quantity * parseInt(product.name),
      }),
    )
    if (err) {
      console.error("[STRIPE] Error creating checkout session", err)
      toast.error("Failed to create checkout session, please try again")
      return
    }
    console.log("[STRIPE] storing pending credits")
    await stripe.redirectToCheckout({
      sessionId: checkoutId,
    })
    console.log("[STRIPE] redirected user to stripe checkout")
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>name: {product.name}</CardTitle>
          <img src={product.images[0]} alt="product img" />
        </CardHeader>
        <CardContent className="flex flex-row gap-4">
          <QuantitySetter {...{ quantity, setQuantity }} />
          <Button onClick={async () => await handleCheckout()}>Buy now</Button>
        </CardContent>
      </Card>
    </div>
  )
}
function QuantitySetter({
  quantity,
  setQuantity,
}: {
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <Button
        onClick={() => setQuantity((prev) => (prev > 0 ? prev - 1 : prev))}
        variant={"outline"}
        disabled={quantity <= 0}
      >
        <Minus />
      </Button>
      <p>{quantity}</p>
      <Button
        onClick={() => setQuantity((prev) => prev + 1)}
        variant={"outline"}
      >
        <Plus />
      </Button>
    </div>
  )
}
