import { unstable_cache } from "next/cache"
import { stripe } from "~/actions/stripe/init-stripe"
import FullScreenError from "~/components/full-screen-error"
import { tryCatch } from "~/lib/tryCatch"
import Product from "./product"

export default async function PricingPage() {
  const [products, error] = await tryCatch(getCachedProducts())
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
const getCachedProducts = unstable_cache(
  async () => getProductList(),
  ["stripe-products"],
)

async function getProductList() {
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
  console.log("[STIRPE] Stripe products fetched - ", products)
  return products
}
