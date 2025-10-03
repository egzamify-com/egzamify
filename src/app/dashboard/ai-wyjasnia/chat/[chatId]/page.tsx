"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { use } from "react"
import Chat from "~/components/ai-wyjasnia/chat"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"

export default function Page({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = use(params)
  const { data, isPending, error } = useQuery(
    api.ai_wyjasnia.query.getThreadMessages,
    {
      chatId,
    },
  )

  if (isPending) {
    return <FullScreenLoading />
  }

  if (error) {
    return (
      <FullScreenError
        errorMessage={"Nie udało się wczytać czatu"}
        errorDetail={error.message}
      />
    )
  }
  // console.log("thread - ", data)
  return <Chat id={chatId} initialMessages={data?.messages ?? []} />
}
