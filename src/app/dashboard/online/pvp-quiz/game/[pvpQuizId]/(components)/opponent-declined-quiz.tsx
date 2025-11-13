import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { Clock, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import type { PvpQuizQueryReturnType } from "../page"

export default function OpponentDeclinedQuiz({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const router = useRouter()
  const deleteQuiz = useMutation(api.pvp_quiz.mutate.deleteDeclinedQuiz)
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border-destructive relative overflow-hidden border-2 shadow-xl">
          <div className="pointer-events-none absolute inset-0 animate-pulse" />

          <CardHeader className="relative z-10 text-center">
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <ActivityStatusAvatar
                  userToShow={quizData.opponentUser}
                  size={80}
                />
                <div className="">
                  <Badge variant="secondary" className="shadow-md">
                    <Clock className="mr-1 h-3 w-3 animate-pulse" />
                    Oczekiwnie
                  </Badge>
                </div>
              </div>
            </div>

            <CardTitle className="pt-2 text-3xl text-balance">
              <p className="text-muted-foreground">
                {quizData.opponentUser.username}
              </p>
              Odrzucono zaproszenie do quizu
            </CardTitle>
            <CardDescription className="text-base text-pretty">
              Przeciwnik odrzucil twoje zaproszenie.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="text-destructive w-full bg-transparent"
              onClick={() => {
                router.push("/dashboard/online")
                deleteQuiz({ quizId: quizData._id })
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Powrot
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
