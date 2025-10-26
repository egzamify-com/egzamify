"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { useState } from "react"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"

export default function ClientCreditSyncPage({
  polarPurchasedCredits,
}: {
  polarPurchasedCredits: number
}) {
  const syncCredits = useMutation(api.payments.mutate.syncUserCreditsWithPolar)
  const [isMutating, setIsMutating] = useState(false)
  const [response, setResponse] = useState<{
    ok: boolean
    mess: string
  } | null>(null)
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      {response && <h1 className="text-xl">{response.mess}</h1>}
      <Button
        variant={"outline"}
        onClick={async () => {
          setIsMutating(true)
          const data = await syncCredits({ polarPurchasedCredits })
          setResponse(data)
          setIsMutating(false)
        }}
      >
        {isMutating ? <SpinnerLoading /> : <>Sprawdź moje kredyty</>}
      </Button>
    </div>
  )
}
