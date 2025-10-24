"use client"

import type { CheckoutStatus } from "@polar-sh/sdk/models/components/checkoutstatus.js"
import RenderToast from "../render-toast"

export default function HandleToasts({
  status,
  productName,
}: {
  status: CheckoutStatus
  productName: string
}) {
  if (status === "succeeded") {
    return (
      <RenderToast
        title={"Płatność zakończona sukcesem"}
        description={`Dodano ${productName} do konta`}
      />
    )
  }
  if (status === "failed") {
    return (
      <RenderToast
        title={"Płatność nie powiodła się"}
        description={`Spróbuj ponownie lub skontaktuj się z nami`}
      />
    )
  }
  return null
}
