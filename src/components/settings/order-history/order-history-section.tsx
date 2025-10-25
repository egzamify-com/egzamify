import type { Doc } from "@convex-dev/auth/server"
import { Gem } from "lucide-react"
import GetCreditsBtn from "~/components/landing-page/get-credits-btn"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { tryCatch } from "~/lib/tryCatch"
import { polarApi } from "~/server/polar"
import OrderItem from "./order-item"

export default async function OrderHistorySection({
  user,
}: {
  user: Doc<"users">
}) {
  const [customer, customerError] = await tryCatch(
    (async () => {
      return await polarApi.customers.getExternal({
        externalId: user._id,
      })
    })(),
  )

  if (customerError) {
    console.error(
      "[POLAR] Failed to get customer from user id in settings page",
    )
    return null
  }
  const [orders, ordersError] = await tryCatch(
    (async () => {
      return await polarApi.orders.list({
        customerId: customer.id,
      })
    })(),
  )

  if (ordersError) {
    console.error("[POLAR] Failed to get order for customer")
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center justify-center gap-2">
            <Gem size={22} />
            <h1 className="text-xl">Zamówienia</h1>
          </div>
          <GetCreditsBtn />
        </CardTitle>
        <CardDescription>Przeglądaj historie swoich zamówień</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.result.items.map((order) => (
          <OrderItem key={crypto.randomUUID()} order={order} />
        ))}
      </CardContent>
    </Card>
  )
}
