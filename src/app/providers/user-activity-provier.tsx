"use client";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function UserActivity({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleUserActivityStatus = useMutation(
    api.users.mutate.toggleUserActivityStatus,
  );

  useEffect(() => {
    (async () => {
      await toggleUserActivityStatus({ newStatus: true });
    })();

    window.addEventListener("beforeunload", () => {
      console.log("ON BEFORE UN LOAD RUN");
      (async () => {
        await toggleUserActivityStatus({ newStatus: false });
      })();
    });
  }, []);

  return <div>{children}</div>;
}
