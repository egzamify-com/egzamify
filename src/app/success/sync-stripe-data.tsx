import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { fetchMutation, fetchQuery } from "convex/nextjs"
// import { toast } from "sonner"
import { Suspense } from "react"
import FullScreenError from "~/components/full-screen-error"
import SpinnerLoading from "~/components/SpinnerLoading"
import { syncStripeDataToKV } from "~/lib/stripe-utils"
import SyncEnd from "./end"

export default async function SyncData({
  customerId,
  sessionId,
  user,
}: {
  customerId: string
  sessionId: string
  user: Doc<"users">
}) {
  try {
    await syncStripeDataToKV(customerId, sessionId)

    const transaction = await fetchQuery(
      api.payments.query.getTransaction,
      { sessionId },
      { token: await convexAuthNextjsToken() },
    )

    switch (transaction.status) {
      case "succeded":
        if (user.pendingCredits) {
          console.log(
            "[STRIPE] Updating user credits, adding - ",
            user.pendingCredits,
          )
          await fetchMutation(
            api.payments.mutate.updateUserCreditsAndClearPendings,
            { creditsToAdd: user.pendingCredits },
            { token: await convexAuthNextjsToken() },
          )
          // toast.success("Payment succeeded")
        }
      case "requires_payment_method":
        clearPendingsAndSkipRealCredits()
      // toast.error("Payment failed")
      case "canceled":
        clearPendingsAndSkipRealCredits()
      // toast.warning("Payment canceled")
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("[STRIPE] stripe data to kv sync failed - ", error)
      return (
        <FullScreenError
          errorMessage="Failed to sync data."
          errorDetail={error.message}
        />
      )
    }
  }
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
      <Suspense fallback={<SpinnerLoading />}>
        <SyncEnd {...{ sessionId }} />
      </Suspense>
    </div>
  )
}
async function clearPendingsAndSkipRealCredits() {
  await fetchMutation(
    api.payments.mutate.updateUserCreditsAndClearPendings,
    { creditsToAdd: 0 },
    { token: await convexAuthNextjsToken() },
  )
}
