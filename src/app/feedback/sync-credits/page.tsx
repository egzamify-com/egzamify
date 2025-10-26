import { parseInt } from "lodash"
import { getNextjsUserOrThrow } from "~/actions/actions"
import { polarApi } from "~/server/polar"
import ClientCreditSyncPage from "./client-page"

export default async function Page() {
  const user = await getNextjsUserOrThrow()
  const userCustomer = await polarApi.customers.getExternal({
    externalId: user._id,
  })
  const {
    result: { items: userOrders },
  } = await polarApi.orders.list({ customerId: userCustomer.id })
  const polarCredits = userOrders.reduce(
    (accumulator, currentOrder) =>
      accumulator + parseInt(currentOrder.product!.name.slice(0, 2)),
    0,
  )

  console.log({ polarCredits })
  return <ClientCreditSyncPage polarPurchasedCredits={polarCredits} />
}
