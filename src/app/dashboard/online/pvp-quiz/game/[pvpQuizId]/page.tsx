"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
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

  const quizDataRef = useRef(pvpQuizQuery.data?.quizData)

  useEffect(() => {
    quizDataRef.current = pvpQuizQuery.data?.quizData
  }, [pvpQuizQuery.data?.quizData])

  useEffect(() => {
    return () => {
      const latestData = quizDataRef.current

      if (!latestData?._id) {
        console.log("No quiz ID found in ref on unmount.")
        return
      }

      if (latestData.status !== "quiz_completed") {
        console.log(
          `Deleting quiz ${latestData._id} because status is ${latestData.status} on unmount.`,
        )
        void deleteQuiz({ quizId: latestData._id })
      } else {
        console.log("Quiz completed, skipping deletion on unmount.")
      }
    }
  }, [deleteQuiz])

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
          switch (pvpQuizQuery.data.quizData.status) {
            case "waiting_for_oponent_accept":
              return (
                <WaitForOpponent
                  {...{ quizData: pvpQuizQuery.data.quizData }}
                />
              )
            case "quiz_pending":
              return (
                <QuizGame
                  {...{
                    quizData: pvpQuizQuery.data.quizData,
                    quizGameStateInitial: pvpQuizQuery.data.quizGameState,
                  }}
                />
              )
            case "quiz_completed":
              return (
                <QuizCompleted
                  {...{
                    quizData: pvpQuizQuery.data.quizData,
                    quizGameState: pvpQuizQuery.data.quizGameState,
                  }}
                />
              )
            case "opponent_declined":
              return (
                <OpponentDeclinedQuiz
                  {...{ quizData: pvpQuizQuery.data.quizData }}
                />
              )
          }
        })()}
      </div>
    </PageHeaderWrapper>
  )
}
