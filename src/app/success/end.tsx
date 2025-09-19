"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"

export default function SyncEnd({ sessionId }: { sessionId: string }) {
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

  if (!transactionPending && transaction?.status === "requires_payment_method")
    <FullScreenError errorMessage="Payment failed" />

  if (!transactionPending && transaction?.status === "canceled")
    <FullScreenError type="warning" errorMessage="Payment canceled" />

  return (
    <div className="h-full w-full items-center justify-center">
      <p>payment status: {transaction?.status}</p>
      <h1>you purchased: {transaction?.creditsPurchased}</h1>
      <h1>current credist: {user?.credits}</h1>
    </div>
  )
}
