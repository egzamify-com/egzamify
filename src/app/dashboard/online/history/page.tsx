"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { usePaginatedQuery } from "convex/react"
import { History } from "lucide-react"
import LoadMoreBtn from "~/components/load-more"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import {
  OnlineModeCard,
  OnlineModeCardSkeleton,
} from "../(components)/quiz-game-card"
import { pvpQuizCardProps } from "../page"

export default function Page() {
  const { data: user } = useQuery(api.users.query.getCurrentUser)
  const { results, status, loadMore } = usePaginatedQuery(
    api.online.query.listMyOnlineActivity,
    {},
    { initialNumItems: 100 },
  )

  if (status === "LoadingFirstPage") {
    return (
      <PageHeaderWrapper isPending={status === "LoadingFirstPage"}>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {[1, 2, 3, 4].map(() => {
            return (
              <div className="w-1/2" key={crypto.randomUUID()}>
                <OnlineModeCardSkeleton />
              </div>
            )
          })}
        </div>
      </PageHeaderWrapper>
    )
  }

  return (
    <PageHeaderWrapper
      title="Historia aktywności"
      description="Twoja aktywność w trybach online."
      icon={<History />}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {results.map((quiz) => {
          if (!user) return
          const didCurrentUserWon = quiz.quiz.winnerUserId === user._id

          const oppUserToCurrentUser =
            quiz.quiz.creatorUserId === user._id ? user : quiz.users.creatorUser

          return (
            <div key={crypto.randomUUID()} className="w-1/2">
              <OnlineModeCard
                {...{
                  ...pvpQuizCardProps(),
                  historyData: {
                    didCurrentUserWon,
                    opponentUser: oppUserToCurrentUser,
                  },
                  href: `/dashboard/online/pvp-quiz/game/${quiz.quiz._id}`,
                }}
              />
            </div>
          )
        })}

        {status === "LoadingMore" && (
          <div className="w-1/2">
            <OnlineModeCardSkeleton />
          </div>
        )}

        <LoadMoreBtn
          canLoadMore={status === "CanLoadMore"}
          onClick={() => loadMore(100)}
        />
      </div>
    </PageHeaderWrapper>
  )
}
