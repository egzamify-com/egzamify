"use client";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import SpinnerLoading from "~/components/SpinnerLoading";
import { tryCatch } from "~/utils/tryCatch";

function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <SpinnerLoading />
      <h1 className="text-2xl font-bold">
        {"We're creating new chat for you..."}
      </h1>
    </div>
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
