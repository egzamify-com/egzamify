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
      navigator.sendBeacon("/api/end-user-activity");
    });
  }, [children, toggleUserActivityStatus]);

  return <div>{children}</div>;
}
