"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import Link from "next/link"
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
      {response && (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h1 className="w-1/2 text-center text-2xl">{response.mess}</h1>
          <Link href={"/feedback"}>
            <Button variant={"outline"}>Powrót</Button>
          </Link>
        </div>
      )}
      {!response && (
        <Button
          variant={"outline"}
          onClick={async () => {
            setIsMutating(true)
            const data = await syncCredits({ polarPurchasedCredits })
            setResponse(data)
            setIsMutating(false)
          }}
        >
          <>{isMutating ? <SpinnerLoading /> : <>Sprawdź moje kredyty</>}</>
        </Button>
      )}
    </div>
  )
}
