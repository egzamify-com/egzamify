import { NextResponse } from "next/server"
import { stripe } from "~/actions/stripe/init-stripe"

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

  const sortedProducts = products.sort(
    (a, b) => a.price.transformed_amount - b.price.transformed_amount,
  )
  return NextResponse.json(sortedProducts)
}
export type GetProductsResponse =
  Awaited<ReturnType<typeof GET>> extends NextResponse<infer T> ? T : never
