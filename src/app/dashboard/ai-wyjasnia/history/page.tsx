"use client";

import { Suspense } from "react";
import HistoryPage from "~/components/ai-wyjasnia/history/history-list";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HistoryPage />
      </Suspense>
    </>
  );
}
