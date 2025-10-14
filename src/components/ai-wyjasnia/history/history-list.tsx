import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "convex/_generated/api"
import { Download } from "lucide-react"
import Link from "next/link"
import FullScreenError from "~/components/full-screen-error"
import { Button } from "~/components/ui/button"
import { LoadingMoreThreads } from "./loading-more"
import ThreadCard from "./thread-card"

export default function HistoryPage() {
  const {
    loadMore,
    results: history,
    status,
  } = usePaginatedQuery(
    api.ai_wyjasnia.query.getAiResponsesHistory,
    {},
    { initialNumItems: 40 },
  )

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5">
        <LoadingMoreThreads count={40} />;
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <FullScreenError
        errorMessage={"You didn't create any chats yet."}
        actionButton={
          <Link href={`/dashboard/ai-wyjasnia`}>
            <Button>Start new chat</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5 bg-gradient-to-br p-4">
      {history.map((item) => (
        <ThreadCard key={item._id} item={item} />
      ))}
      {status == "LoadingMore" && <LoadingMoreThreads count={40} />}
      {status === "CanLoadMore" && (
        <Button onClick={() => loadMore(40)}>
          <Download />
          Load More
        </Button>
      )}
    </div>
  )
}
