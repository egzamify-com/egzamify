"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import type Stripe from "stripe"
import { createStripeCheckout } from "~/actions/stripe/create-stripe-checkout"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import useStripe from "~/hooks/use-stripe"

export default function Product({ product }: { product: Stripe.Product }) {
  const [quantity, setQuantity] = useState(1)
  const updateUserPendingCredits = useMutation(
    api.payments.mutate.updatePendingCredits,
  )
  const stripePromise = useStripe()
  async function handleCheckout() {
    console.log("[STRIPE] Checkout handler started")
    const productPriceId = product.default_price
    if (!productPriceId) {
      console.error(
        "[STRIPE] Product doesnt have a price (?), product id - ",
        product.id,
      )
      return
    }

    const checkoutId = await createStripeCheckout(
      JSON.stringify(productPriceId),
      quantity,
    )
    const stripe = await stripePromise()
    if (!stripe) {
      console.error("[STRIPE] Stripe on client not initialized")
      return
    }
    // here before redirect, store in db amount of credits user attempts to buy, after success page renders,
    // update actual users credits, and clear the pending ones (prolly the cleanest and easiest way to know how much credits to add after
    // successful puchase)
    await updateUserPendingCredits({
      pendingCreditsToAdd: quantity * parseInt(product.name),
    })

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
