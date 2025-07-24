"use client";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import FullScreenDashboardLoading from "~/components/full-screen-loading-dashboard";
import { tryCatch } from "~/utils/tryCatch";

function Loading() {
  return (
    <FullScreenDashboardLoading
      loadingMessage={"We're creating new chat for you..."}
    />
  );
}

export default function Page() {
  const storeNewThread = useMutation(api.ai_wyjasnia.mutate.storeNewThread);
  useEffect(() => {
    (async () => {
      const [createdDbId, err] = await tryCatch(storeNewThread());
      if (err) {
        console.log("Error creating thread", err);
        return;
      }
      redirect(`/dashboard/ai-wyjasnia/chat/${createdDbId}`);
    })();
  }, [storeNewThread]);
  return <Loading />;
}
