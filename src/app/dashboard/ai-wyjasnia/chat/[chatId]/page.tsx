"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { use } from "react";
import Chat from "~/components/ai-wyjasnia/chat";
import FullScreenError from "~/components/full-screen-error";
import FullScreenLoading from "~/components/full-screen-loading";

export default function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);

  const { data, isPending, error } = useQuery(
    api.ai_wyjasnia.query.getThreadMessages,
    {
      chatId,
    },
  );

  if (isPending) {
    return <FullScreenLoading />;
  }

  if (error) {
    return (
      <FullScreenError
        errorMessage={"Loading chat error"}
        errorDetail={error.message}
      />
    );
  }

  return <Chat id={chatId} initialMessages={data} />;
}
