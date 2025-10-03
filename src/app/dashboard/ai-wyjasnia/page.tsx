"use client"

import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import FullScreenLoading from "~/components/full-screen-loading"
import { tryCatch } from "~/lib/tryCatch"

export default function Page() {
  const storeNewThread = useMutation(api.ai_wyjasnia.mutate.storeNewThread)
  useEffect(() => {
    ;(async () => {
      const [createdDbId, err] = await tryCatch(storeNewThread())
      if (err) {
        console.log("Error creating thread", err)
        return
      }
      redirect(`/dashboard/ai-wyjasnia/chat/${createdDbId}`)
    })()
  }, [storeNewThread])
  return (
    <FullScreenLoading loadingMessage={"Tworzymy nowy czat dla ciebie..."} />
  )
}
