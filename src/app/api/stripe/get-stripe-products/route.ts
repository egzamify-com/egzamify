import { NextResponse } from "next/server"
import { stripe } from "~/actions/stripe/init-stripe"

export const dynamic = "force-static"

export async function GET() {
  const stripeProducts = await stripe.products.list({ active: true })
  const productsPromises = stripeProducts.data
    .reverse()
    .map(async (product) => {
      const price = await stripe.prices.retrieve(
        product.default_price as string,
      )

      return {
        ...product,
        price: {
          ...price,
          transformed_amount: (price.unit_amount ?? 0) / 100,
        },
      }
    })
  const products = await Promise.all(productsPromises)
  console.log(
    "[STIRPE] Stripe products fetched - ",
    products.map((product) => product.name),
  )
  return NextResponse.json(products)
}
export type GetProductsResponse =
  Awaited<ReturnType<typeof GET>> extends NextResponse<infer T> ? T : never
