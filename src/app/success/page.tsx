import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import FullScreenLoading from "~/components/full-screen-loading"
import SyncData from "./sync-stripe-data"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId: string }>
}) {
  console.log({ searchParams })
  console.log("[STRIPE] Success server component code started")
  const user = await fetchQuery(
    api.users.query.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  )
  if (!user) {
    console.log("[AUTH] User not found on succes page (?)")
    return redirect("/")
  }

  const customerId = await fetchQuery(
    api.payments.query.getStripeCustomerId,
    {},
    { token: await convexAuthNextjsToken() },
  )

  if (!customerId) {
    console.log("[STRIPE] Customer id not found on success page (?)")
    return redirect("/")
  }

  return (
    <>
      <Suspense
        fallback={
          <FullScreenLoading
            loadingMessage="Thank you, we received your payment!"
            loadingDetail="Finalizing transaction"
          />
        }
      >
        <SyncData
          customerId={customerId}
          sessionId={(await searchParams).sessionId}
          user={user}
        />
      </Suspense>
    </>
  )
}
