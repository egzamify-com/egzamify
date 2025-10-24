"use client"

import type { Product } from "@polar-sh/sdk/models/components/product.js"
import type { Doc } from "convex/_generated/dataModel"
import { Gem } from "lucide-react"
import Link from "next/link"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"

export default function ProductCard({
  product,
  user,
}: {
  product: Product
  user: Doc<"users">
}) {
  const productPrice = useGetProductPriceInPln(product)

  return (
    <Card
      key={crypto.randomUUID()}
      className={cn(
        `relative flex flex-col gap-0 transition-all duration-300 hover:shadow-lg`,
        true
          ? "border-primary hover:border-muted-foreground scale-105 shadow-lg"
          : "border-border hover:border-muted-foreground",
      )}
    >
      {true && (
        <Badge className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 transform">
          Popularne
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {true && (
            <Badge variant={"outline"} className="text-lg font-bold">
              Popular
            </Badge>
          )}
        </CardTitle>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-primary flex flex-row items-center justify-center gap-2 text-4xl font-bold">
            <Gem className="h-9 w-9" />
            {product.name}
          </span>
        </div>
        <div className="text-accent-foreground mt-2 text-xl font-semibold">
          <h2>{productPrice} PLN</h2>
        </div>
      </CardHeader>

      <CardFooter className="pt-6">
        <Link
          href={`/checkout?products=${product.id}&customerExternalId=${user._id}`}
          className="w-full"
        >
          <Button
            variant={true ? "default" : "outline"}
            className={`h-14 w-full text-lg font-semibold`}
            size="lg"
          >
            Zakup
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function useGetProductPriceInPln(product: Product) {
  const USD_TO_PLN_RATE = 3.6439
  const productPriceInCents =
    product.prices[0]?.amountType === "fixed" && product.prices[0].priceAmount
  if (!productPriceInCents) return null
  const usdAmount = productPriceInCents / 100
  const plnAmount = usdAmount * USD_TO_PLN_RATE

  const withTax = plnAmount * 1.23

  return parseFloat(withTax.toFixed(0))
}
