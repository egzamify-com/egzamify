import { stripe } from "~/actions/stripe/init-stripe"
import { tryCatch } from "~/lib/tryCatch"
import Product from "./product"

export default async function PricingPage() {
  const [products, error] = await tryCatch(getProductList())
  if (error) {
    console.error("[STRIPE] Error fetching stripe products - ", error)
    return <div>failed to get products sorry.</div>
  }

  if (products.length === 0) {
    console.error("[STRIPE] No products found (?)")
    return <div>No products found. (?)</div>
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1>pricing page</h1>
      <p>you can buy credits here</p>
      {products.map((product) => (
        <Product key={crypto.randomUUID()} {...{ product }} />
      ))}
    </div>
  )
}
async function getProductList() {
  const stripeProducts = await stripe.products.list({ active: true })
  console.log("[STIRPE] Stripe products fetched - ", stripeProducts.data)
  return stripeProducts.data
}
