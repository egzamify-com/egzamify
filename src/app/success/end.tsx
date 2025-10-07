"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import DashboardBtn from "~/components/landing-page/dashboard-btn"
import useBlockNavigation from "~/hooks/use-block-navigation"
import RenderToast from "./render-toast"

export default function SyncEnd({ sessionId }: { sessionId: string }) {
  useBlockNavigation(true)
  const { data: user, isPending: userPending } = useQuery(
    api.users.query.getCurrentUser,
  )
  const { data: transaction, isPending: transactionPending } = useQuery(
    api.payments.query.getTransaction,
    {
      sessionId,
    },
  )

  if (transactionPending || userPending) <FullScreenLoading />

  if (!user && !userPending) {
    console.error("[STRIPE] Failed to get user")
    return <FullScreenError errorMessage={"Failed to get user"} />
  }

  if (!transaction && !transactionPending) {
    console.error("[STRIPE] Failed to get transaction")
    return <FullScreenError errorMessage={"Failed to get transaction"} />
  }

  if (!transactionPending && transaction?.status === "requires_payment_method")
    <FullScreenError errorMessage="Payment failed" />

  if (!transactionPending && transaction?.status === "canceled")
    <FullScreenError type="warning" errorMessage="Payment canceled" />

  return (
    <>
      {transaction && user && (
        <>
          <h1 className="text-3xl font-bold">{`Dziękujemy za zakup!`}</h1>
          <h1 className="text-xl font-bold">{`Zakupiono ${transaction.creditsPurchased} kredytów!`}</h1>
          <DashboardBtn />
          <RenderToast
            transactionStatus={transaction.status}
            purchasedCredits={transaction.creditsPurchased}
          />
        </>
      )}
    </>
  )
}
