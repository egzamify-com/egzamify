"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { use } from "react";
import FullScreenDashboardError from "~/components/full-screen-error-dashboard";
import Chat from "../../chat";

export default function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);

  const { data, error } = useQuery(api.ai_wyjasnia.query.getThreadMessages, {
    chatId,
  });
  console.log("new msgs in client - ", data);
  if (error) {
    return (
      <FullScreenDashboardError
        errorMessage={"Loading chat error"}
        errorDetail={error.message}
      />
    );
  }

  return <Chat id={chatId} initialMessages={data} />;
}
