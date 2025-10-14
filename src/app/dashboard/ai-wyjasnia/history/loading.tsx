import { LoadingMoreThreads } from "~/components/ai-wyjasnia/history/loading-more"
import PageHeaderWrapper from "~/components/page-header-wrapper"

export default function Loading() {
  return (
    <PageHeaderWrapper isPending={true}>
      <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5">
        <LoadingMoreThreads count={41} />;
      </div>
    </PageHeaderWrapper>
  )
}
