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
    toast.success("Płatność zakończona sukcesem", {
      description: purchasedCredits
        ? `Dodano ${purchasedCredits} kredytów do konta`
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
    toast.warning("Anulowano płatność", {
      action: (
        <>
          <Link href={"/pricing"}>
            <Button>Spróbuj ponownie</Button>
          </Link>
        </>
      ),
    })
    return null
  }

  if (transactionStatus === "requires_payment_method") {
    toast.error("Płatność nie powiodła się", {
      description: `Spróbuj ponownie`,
      action: (
        <>
          <Link href={"/pricing"}>
            <Button>Spróbuj ponownie</Button>
          </Link>
        </>
      ),
    })
    return null
  }
  return null
}
