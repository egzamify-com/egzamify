"use client"

import { useQuery } from "@tanstack/react-query"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import { env } from "~/env"
import type { GetProductsResponse } from "../api/stripe/get-stripe-products/route"
import Product from "./product"

export default function Page() {
  const {
    data: products,
    error,
    isPending,
  } = useQuery({
    queryFn: getProducts,
    queryKey: ["stripe-products"],
  })
  if (error) {
    console.error("[STRIPE] Error fetching stripe products - ", error)
    return (
      <FullScreenError
        errorDetail={error.message}
        errorMessage="Coś poszło nie tak."
      />
    )
  }
  if (isPending) {
    return <FullScreenLoading />
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
            {`Wybierz swój pakiet kredytów`}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
            {`Zdobądź kredyty do nauki z AI dzięki jednorazowym zakupom. Bez
            subskrypcji, bez cyklicznych opłat – zakup kredyty i ucz się
            we własnym tempie.`}
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
