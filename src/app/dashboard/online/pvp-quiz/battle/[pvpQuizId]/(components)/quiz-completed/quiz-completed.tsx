import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import type { PvpQuizQueryReturnType } from "../../page"
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
        errorMessage="Cos poszlo nie tak"
        errorDetail={error.message}
      />
    )
  }
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-8 p-6 xl:w-3/5">
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
    </div>
  )

  // return (
  //   <div className="flex flex-1 flex-col items-center justify-center">
  //     <Card className="w-3/4">
  //       <CardHeader>
  //         <CardTitle>
  //           {data.currentUser._id === data.winnerUser._id ? (
  //             <p className="text-green-500">Wygrales!</p>
  //           ) : (
  //             <p className="text-destructive">Przegrales :(</p>
  //           )}
  //         </CardTitle>
  //         <CardDescription>
  //           <p>Quiz zakonczony, porownaj swoje wyniki z przeciwnikiem.</p>
  //         </CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="flex flex-col gap-2">
  //           <div className="flex flex-row items-center justify-between gap-10">
  //             <QuizCompleteUserCard
  //               {...{
  //                 user: data.creatorUser,
  //                 isWinner: data.creatorUser._id === data.winnerUser._id,
  //                 quizData,
  //                 currentUser: data.currentUser,
  //               }}
  //             />
  //             <QuizCompleteUserCard
  //               {...{
  //                 user: data.opponentUser,
  //                 isWinner: data.opponentUser._id === data.winnerUser._id,
  //                 quizData,
  //                 currentUser: data.currentUser,
  //               }}
  //             />
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </div>
  // )
}
