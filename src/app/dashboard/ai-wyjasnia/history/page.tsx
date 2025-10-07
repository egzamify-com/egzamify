"use client"

import { History } from "lucide-react"
import HistoryPage from "~/components/ai-wyjasnia/history/history-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Historia czatów"
      icon={<History size={pageHeaderWrapperIconSize} />}
    >
      <HistoryPage />
    </PageHeaderWrapper>
  )
}
