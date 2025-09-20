"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import Link from "next/link"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import { Button } from "~/components/ui/button"
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
          <h1 className="text-3xl font-bold">{`Thank you!`}</h1>
          <h1 className="text-xl font-bold">{`You purchased ${transaction.creditsPurchased} credits!`}</h1>
          <Link href={"/dashboard"}>
            <Button>Back to the app</Button>
          </Link>
          <RenderToast
            transactionStatus={transaction.status}
            purchasedCredits={transaction.creditsPurchased}
          />
        </>
      )}
    </>
  )
}
