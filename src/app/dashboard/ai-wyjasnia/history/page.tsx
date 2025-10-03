"use client"

import HistoryPage from "~/components/ai-wyjasnia/history/history-list"
import PageHeaderWrapper from "~/components/page-header-wrapper"

export default function Page() {
  return (
    <PageHeaderWrapper title="Historia czatów">
      <HistoryPage />
    </PageHeaderWrapper>
  )
}
