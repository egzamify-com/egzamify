import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import type { PvpQuizQueryReturnType } from "../page"

export default function QuizCompleted({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const currentUser = useQuery(api.users.query.getCurrentUser)
  const winner = useQuery(api.users.query.getUserFromId, {
    userId: quizData.winnerUserId!,
  })
  console.log({ winner })
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Quiz zakonczony</h1>
          </CardTitle>
          <CardDescription>
            <p>jakis opis tu</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {winner.data && currentUser.data && (
            <>
              <div>
                {winner.data._id === currentUser.data._id ? (
                  <p className="text-green-500">Wygrales!</p>
                ) : (
                  <p className="text-destructive">Przegrales :(</p>
                )}
              </div>
              <div>
                Winner:
                <ActivityStatusAvatar userToShow={winner.data} />
                {quizData.winnerType === "by_time" ? "by time" : "by score"}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
