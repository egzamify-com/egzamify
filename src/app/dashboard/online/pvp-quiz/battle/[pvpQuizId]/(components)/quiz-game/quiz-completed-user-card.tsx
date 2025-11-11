import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { Badge } from "~/components/ui/badge"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { convertEpochToYYYYMMDD } from "~/lib/dateUtils"
import type { PvpQuizQueryReturnType } from "../../page"

export default function QuizCompleteUserCard({
  user,
  isWinner,
  quizData,
  currentUser,
}: {
  user: Doc<"users">
  isWinner: boolean
  quizData: PvpQuizQueryReturnType
  currentUser: Doc<"users">
}) {
  const userData =
    (user._id === quizData.creatorUserId && quizData.creatorData) ||
    quizData.opponentData

  const userAnswersQuery = useQuery(api.pvp_quiz.query.getAnswersFromIdArray, {
    userAnswersIds: userData!.answersIds!,
  })

  if (!userData) return null

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-start gap-4">
        <ActivityStatusAvatar userToShow={user} />
        <p className="sm:text-lg">{user.username}</p>
      </div>
      {isWinner && (
        <div>
          <h1 className="sm:text-lg">
            Zwyciezca poprzez{" "}
            {quizData.winnerType === "by_score" ? "punkty" : "czas"}
          </h1>
        </div>
      )}
      {user._id === currentUser._id && <Badge>Ty</Badge>}
      <h1>Punkty: {userData.score}</h1>
      <h1>Czas: {convertEpochToYYYYMMDD(userData.time!)}</h1>
      {userAnswersQuery.data && (
        <>
          {userAnswersQuery.data.map((answer) => {
            return <div>{answer?.originalAnswer.content.slice(0, 30)}...</div>
          })}
        </>
      )}
    </div>
  )
}
