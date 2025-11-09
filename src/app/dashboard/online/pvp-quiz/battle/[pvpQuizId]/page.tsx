"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useParams } from "next/navigation"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { parseConvexError } from "~/lib/utils"
export default function Page() {
  const { pvpQuizId }: { pvpQuizId: string } = useParams()
  const pvpQuizQuery = useQuery(api.pvp_quiz.query.getPvpQuiz, {
    pvpQuizId: pvpQuizId as Id<"pvpQuizzes">,
  })
  if (pvpQuizQuery.isError) {
    return (
      <FullScreenError
        errorDetail={parseConvexError(pvpQuizQuery.error)}
        errorMessage="Cos poszlo nie tak."
      />
    )
  }

  if (pvpQuizQuery.isPending) {
    return <FullScreenLoading />
  }

  console.log(pvpQuizQuery.data)
  return (
    <>
      {pvpQuizId}
      {pvpQuizQuery.data && (
        <div>
          <p>creator {pvpQuizQuery.data.creatorUserId}</p>
          <ActivityStatusAvatar userToShow={pvpQuizQuery.data.creatorUser} />
          <p>opponent {pvpQuizQuery.data.opponentUserId}</p>
          <ActivityStatusAvatar userToShow={pvpQuizQuery.data.opponentUser} />
        </div>
      )}
    </>
  )
}
