"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { APP_CONFIG } from "~/APP_CONFIG"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { parseConvexError } from "~/lib/utils"
import OpponentDeclinedQuiz from "./(components)/opponent-declined-quiz"
import QuizCompleted from "./(components)/quiz-completed/quiz-completed"
import QuizGame from "./(components)/quiz-game/quiz-game"
import WaitForOpponent from "./(components)/wait-for-opponent"

export type PvpQuizQueryReturnType = FunctionReturnType<
  typeof api.online.pvp_quiz.query.getPvpQuiz
>

export default function Page() {
  const { pvpQuizId }: { pvpQuizId: string } = useParams()

  const pvpQuizQuery = useQuery(api.online.pvp_quiz.query.getPvpQuiz, {
    pvpQuizId: pvpQuizId as Id<"pvpQuizzes">,
  })

  const deleteQuiz = useMutation(api.online.pvp_quiz.mutate.deleteQuiz)

  useEffect(() => {
    return () => {
      void (async () => {
        if (!pvpQuizQuery.data?._id) return
        await deleteQuiz({ quizId: pvpQuizQuery.data._id })
      })()
    }
  }, [pvpQuizQuery.data?._id, deleteQuiz])

  if (pvpQuizQuery.isPending) {
    return <FullScreenLoading />
  }

  if (pvpQuizQuery.isError || !pvpQuizQuery.data) {
    return (
      <FullScreenError
        errorDetail={parseConvexError(pvpQuizQuery.error)}
        errorMessage={APP_CONFIG.defaultFullScreenErrorMessage}
      />
    )
  }

  return (
    <PageHeaderWrapper>
      <div>
        {(() => {
          switch (pvpQuizQuery.data.status) {
            case "waiting_for_oponent_accept":
              return <WaitForOpponent {...{ quizData: pvpQuizQuery.data }} />
            case "quiz_pending":
              return <QuizGame {...{ quizData: pvpQuizQuery.data }} />
            case "quiz_completed":
              return <QuizCompleted {...{ quizData: pvpQuizQuery.data }} />
            case "opponent_declined":
              return (
                <OpponentDeclinedQuiz {...{ quizData: pvpQuizQuery.data }} />
              )
          }
        })()}
      </div>
    </PageHeaderWrapper>
  )
}
