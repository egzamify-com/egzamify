"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { FunctionReturnType } from "convex/server"
import { useParams } from "next/navigation"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import { parseConvexError } from "~/lib/utils"
import QuizCompleted from "./(components)/quiz-completed/quiz-completed"
import QuizGame from "./(components)/quiz-game/quiz-game"
import WaitForOpponent from "./(components)/wait-for-opponent"

export type PvpQuizQueryReturnType = FunctionReturnType<
  typeof api.pvp_quiz.query.getPvpQuiz
>

export default function Page() {
  const { pvpQuizId }: { pvpQuizId: string } = useParams()

  const pvpQuizQuery = useQuery(api.pvp_quiz.query.getPvpQuiz, {
    pvpQuizId: pvpQuizId as Id<"pvpQuizzes">,
  })

  if (pvpQuizQuery.isPending) {
    return <FullScreenLoading />
  }

  if (pvpQuizQuery.isError || !pvpQuizQuery.data) {
    return (
      <FullScreenError
        errorDetail={parseConvexError(pvpQuizQuery.error)}
        errorMessage="Cos poszlo nie tak."
      />
    )
  }

  console.log(pvpQuizQuery.data)

  switch (pvpQuizQuery.data.status) {
    case "waiting_for_oponent_accept":
      return <WaitForOpponent {...{ quizData: pvpQuizQuery.data }} />
    case "quiz_pending":
      return <QuizGame {...{ quizData: pvpQuizQuery.data }} />
    case "quiz_completed":
      return <QuizCompleted {...{ quizData: pvpQuizQuery.data }} />
  }
}
