"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { Gem } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type Stripe from "stripe"
import { createStripeCheckout } from "~/actions/stripe/create-stripe-checkout"
import SpinnerLoading from "~/components/spinner-loading"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import useStripe from "~/hooks/use-stripe"
import { tryCatch } from "~/lib/tryCatch"
import { cn } from "~/lib/utils"

export default function Product({
  product,
}: {
  product: Stripe.Product & {
    price: Stripe.Price & {
      transformed_amount: number
    }
  }
}) {
  const popular = product.metadata.popular
  const [quantity, setQuantity] = useState(1)
  const [mutationPending, setMutationPending] = useState(false)
  const updateUserPendingCredits = useMutation(
    api.payments.mutate.updatePendingCredits,
  )
  const stripePromise = useStripe()
  async function handleCheckout() {
    console.log("[STRIPE] Checkout handler started")
    setMutationPending(true)
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

    const [, err] = await tryCatch(
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
    setMutationPending(false)
    console.log("[STRIPE] redirected user to stripe checkout")
  }
  return (
    <Card
      key={crypto.randomUUID()}
      className={cn(
        `relative flex flex-col gap-0 transition-all duration-300 hover:shadow-lg`,
        popular
          ? "border-primary hover:border-muted-foreground scale-105 shadow-lg"
          : "border-border hover:border-muted-foreground",
      )}
    >
      {popular && (
        <Badge className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 transform">
          Popularne
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {product.metadata.label && (
            <Badge variant={"outline"} className="text-lg font-bold">
              {product.metadata.label}
            </Badge>
          )}
        </CardTitle>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-primary flex flex-row items-center justify-center gap-2 text-4xl font-bold">
            <Gem className="h-9 w-9" />
            {parseInt(product.name) * quantity}
          </span>
        </div>
        <div className="text-accent-foreground mt-2 text-xl font-semibold">
          {product.price.transformed_amount * quantity} PLN
        </div>
      </CardHeader>

      <CardFooter className="pt-6">
        <Button
          variant={popular ? "default" : "outline"}
          className={`h-14 w-full text-lg font-semibold`}
          size="lg"
          onClick={async () => await handleCheckout()}
          // disabled={mutationPending}
          disabled={true}
        >
          {mutationPending ? <SpinnerLoading /> : <>Zakup</>}
        </Button>
      </CardFooter>
    </Card>
  )
}
