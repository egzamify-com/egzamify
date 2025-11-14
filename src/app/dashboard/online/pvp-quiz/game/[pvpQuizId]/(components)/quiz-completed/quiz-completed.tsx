import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import type { FunctionReturnType } from "convex/server"
import { APP_CONFIG } from "~/APP_CONFIG"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { parseConvexError } from "~/lib/utils"
import type { PvpQuizQueryReturnType } from "../../page"
import FullQuestionCard, {
  type FullQuestionPlayerData,
} from "../quiz-game/complete-question-card"
import { transformQuizDataToQuizState } from "../quiz-game/quiz-game"
import QuizCompletedResultHeader from "./quiz-completed-result-header"
import { QuizCompletedPlayerStatsCard } from "./quiz-completed-user-card"

export default function QuizCompleted({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const { data, isPending, error } = useQuery(
    api.pvp_quiz.query.getUsersFromQuiz,
    { quizId: quizData._id },
  )

  if (isPending) {
    return <FullScreenLoading />
  }

  if (error || !data) {
    return (
      <FullScreenError
        errorMessage={APP_CONFIG.defaultFullScreenErrorMessage}
        errorDetail={parseConvexError(error)}
      />
    )
  }

  return (
    <PageHeaderWrapper>
      <div className="flex w-full flex-col items-center justify-center gap-8 p-6">
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <QuizCompletedResultHeader
            {...{
              isCurrentUserWinner: data.currentUser._id === data.winnerUser._id,
              winnerPlayerData: data.winnerUser,
              winnerType: quizData.winnerType,
            }}
          />

          <div className="grid w-full gap-6 md:grid-cols-2">
            <QuizCompletedPlayerStatsCard
              {...{
                quizData,
                isCurrentUser: quizData.creatorUserId === data.currentUser._id,
                user: quizData.creatorUser,
                cardIndex: 0,
                playerType: "creator",
              }}
            />
            <QuizCompletedPlayerStatsCard
              {...{
                quizData,
                isCurrentUser: quizData.opponentUserId === data.currentUser._id,
                user: quizData.opponentUser,
                cardIndex: 0,
                playerType: "opponent",
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-start gap-8">
          {transformQuizDataToQuizState(quizData).map((questionItem, index) => {
            const { answers, ...question } = questionItem

            const { currentUserQuizData, otherUserQuizData } = calcRoles(
              data,
              quizData,
            )

            return (
              <FullQuestionCard
                key={crypto.randomUUID()}
                {...{
                  questionAdditionalMetadata: {
                    questionNumber: index + 1,
                  },
                  showQuestionMetadata: true,
                  nonInteractive: true,
                  question: question,
                  answers: answers,
                  currentUserQuizData,
                  otherUserQuizData,
                }}
              />
            )
          })}
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

function calcRoles(
  data: FunctionReturnType<typeof api.pvp_quiz.query.getUsersFromQuiz>,
  quizData: PvpQuizQueryReturnType,
) {
  let currentUserQuizData: FullQuestionPlayerData = {
    userProfile: data.currentUser,
    userData: null,
  }
  let otherUserQuizData: FullQuestionPlayerData = {
    userProfile: null,
    userData: null,
  }
  if (data.currentUser._id === quizData.creatorUserId) {
    currentUserQuizData = {
      ...currentUserQuizData,
      userData: quizData.creatorData,
    }
    otherUserQuizData = {
      userProfile: quizData.opponentUser,
      userData: quizData.opponentData,
    }
  } else {
    currentUserQuizData = {
      ...currentUserQuizData,
      userData: quizData.opponentData,
    }
    otherUserQuizData = {
      userProfile: quizData.creatorUser,
      userData: quizData.creatorData,
    }
  }
  return { currentUserQuizData, otherUserQuizData }
}
