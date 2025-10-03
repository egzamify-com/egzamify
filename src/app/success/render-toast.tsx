import type { api } from "convex/_generated/api"
import type { FunctionReturnType } from "convex/server"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"

export default function RenderToast({
  transactionStatus,
  purchasedCredits,
}: {
  transactionStatus: FunctionReturnType<
    typeof api.payments.query.getTransaction
  >["status"]
  purchasedCredits: string | undefined
}) {
  if (!transactionStatus) {
    return null
  }

  if (transactionStatus === "succeded") {
    toast.success("Payment succeeded", {
      description: purchasedCredits
        ? `Added ${purchasedCredits} credits to your account`
        : null,
      action: (
        <>
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        </>
      ),
    })
    return null
  }

  if (transactionStatus === "canceled") {
    toast.warning("Payment canceled", {
      description: `You canceled the payment`,
      action: (
        <>
          <Link href={"/pricing"}>
            <Button>Try again</Button>
          </Link>
        </>
      ),
    })
    return null
  }

  if (transactionStatus === "requires_payment_method") {
    toast.error("Payment failed", {
      description: `Please try again`,
      action: (
        <>
          <Link href={"/pricing"}>
            <Button>Try again</Button>
          </Link>
        </>
      ),
    })
    return null
  }
  return null
}
