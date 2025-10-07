"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import { env } from "~/env"
import type { GetProductsResponse } from "../api/stripe/get-stripe-products/route"
import Product from "./product"

export default function Page() {
  return (
    <Suspense fallback={<FullScreenLoading />}>
      <PricingPage />
    </Suspense>
  )
}

export function PricingPage() {
  const { data: products, error } = useSuspenseQuery({
    queryFn: getProducts,
    queryKey: ["stripe-products"],
  })
  // const [products, error] = await tryCatch(getProducts())
  if (error) {
    console.error("[STRIPE] Error fetching stripe products - ", error)
    return (
      <FullScreenError
        errorDetail={error.message}
        errorMessage="Sorry, this page in unavailable."
      />
    )
  }

  if (products.length === 0) {
    console.error("[STRIPE] No products found (?)")
    return (
      <FullScreenError
        errorMessage="Sorry, no products found."
        type="warning"
      />
    )
  }

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold text-balance">
            Choose Your Credit Package
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
            Get AI learning credits with one-time purchases. No subscriptions,
            no recurring fees - just pay once and learn at your own pace
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {products.map((product) => (
            <Product key={crypto.randomUUID()} {...{ product }} />
          ))}
        </div>
      </div>
    </div>
  )
}
async function getProducts() {
  const baseUrl = env.NEXT_PUBLIC_BASE_SERVER_URL
    ? `${env.NEXT_PUBLIC_BASE_SERVER_URL}`
    : "http://localhost:3000"
  console.log("fetchinf products from this url")
  console.log({ baseUrl })

  const res = await fetch(`${baseUrl}/api/stripe/get-stripe-products`)
  if (!res.ok) {
    console.error(res)
    throw new Error("Failed to fetch products")
  }
  const products: GetProductsResponse = await res.json()
  return products
}
