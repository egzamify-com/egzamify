import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import type { FunctionReturnType } from "convex/server"
import { APP_CONFIG } from "~/APP_CONFIG"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { parseConvexError } from "~/lib/utils"
import type { PvpQuizQueryReturnType } from "../../page"
import CompleteQuestion, {
  type CompleteQuestionPlayerData,
} from "../quiz-game/complete-question-card/complete-question"
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
              <CompleteQuestion
                key={crypto.randomUUID()}
                {...{
                  questionAdditionalMetadata: {
                    questionNumber: index + 1,
                  },
                  showQuestionMetadata: true,
                  nonInteractive: true,
                  question: question,
                  answers: answers,
                  currentUserQuizData: {
                    userProfile: currentUserQuizData.userProfile,
                    userAnswersIds: currentUserQuizData.userAnswersIds,
                  },
                  otherUsersQuizData: [
                    {
                      userProfile: otherUserQuizData.userProfile,
                      userAnswersIds: otherUserQuizData.userAnswersIds,
                    },
                  ],
                  showExplanationBtn: true,
                  showCorrectAnswer: true,
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
  let currentUserQuizData: CompleteQuestionPlayerData = {
    userProfile: data.currentUser,
    userAnswersIds: undefined,
  }
  let otherUserQuizData: CompleteQuestionPlayerData = {
    userProfile: undefined,
    userAnswersIds: undefined,
  }
  if (data.currentUser._id === quizData.creatorUserId) {
    currentUserQuizData = {
      ...currentUserQuizData,
      userAnswersIds: quizData.creatorData?.answersIds,
    }
    otherUserQuizData = {
      userProfile: quizData.opponentUser,
      userAnswersIds: quizData.opponentData?.answersIds,
    }
  } else {
    currentUserQuizData = {
      ...currentUserQuizData,
      userAnswersIds: quizData.opponentData?.answersIds,
    }
    otherUserQuizData = {
      userProfile: quizData.creatorUser,
      userAnswersIds: quizData.creatorData?.answersIds,
    }
  }
  return { currentUserQuizData, otherUserQuizData }
}
