import ProductCard from "~/components/payments/product-card"
import { polarApi } from "~/server/polar"
export async function getProducts() {
  const { result } = await polarApi.products.list({
    isArchived: false,
  })
  const products = result.items
  console.log({ products })
  return products
}

export default async function PricingPage() {
  const products = await getProducts()
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
            <ProductCard key={crypto.randomUUID()} {...{ product }} />
          ))}
        </div>
      </div>
    </div>
  )
}
