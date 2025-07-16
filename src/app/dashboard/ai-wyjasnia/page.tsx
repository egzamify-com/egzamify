"use client";

import { generateId } from "ai";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { tryCatch } from "~/utils/tryCatch";

export default function Page() {
  const storeNewThread = useMutation(api.ai_wyjasnia.mutate.storeNewThread);
  useEffect(() => {
    (async () => {
      const id = generateId();
      const [res, err] = await tryCatch(storeNewThread({ threadId: id }));
      if (err) {
        console.log("Error creating thread", err);
        return;
      }

      redirect(`/dashboard/ai-wyjasnia/chat/${id}`);
    })();
  }, [storeNewThread]);
}
