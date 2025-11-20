import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { Clock, InfoIcon, X } from "lucide-react"
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

export default function WaitForOpponent({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const router = useRouter()
  const playerData = quizData.opponentUser
  const deleteQuiz = useMutation(api.online.pvp_quiz.mutate.deleteQuiz)

  return (
    <div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-lg">
        <Card className="relative overflow-hidden border-2 shadow-xl">
          <div className="from-primary/5 via-primary/10 to-primary/5 pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r" />

          <CardHeader className="relative text-center">
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <ActivityStatusAvatar userToShow={playerData} size={80} />
                <div className="">
                  <Badge variant="secondary" className="shadow-md">
                    <Clock className="mr-1 h-3 w-3 animate-pulse" />
                    Oczekiwnie
                  </Badge>
                </div>
              </div>
            </div>

            <CardTitle className="pt-2 text-3xl text-balance">
              Oczekiwanie na
              <p className="text-muted-foreground">{playerData.username}</p>
            </CardTitle>
            <CardDescription className="text-base text-pretty">
              {
                "Wyslano zaproszenie do wspólnego quizu. Poczekaj na zaakceptowanie zaproszenia przez przeciwnika."
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="space-y-3 rounded-lg bg-transparent p-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <InfoIcon className="h-4 w-4" />
                Szczegoly
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Kwalifikacja</p>
                  <p className="font-semibold">
                    {quizData.quizQualification?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Pytania</p>
                  <p className="font-semibold">
                    {quizData.quizQuestionsIds.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-4">
              <div className="flex gap-2">
                <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                <div className="bg-primary h-3 w-3 animate-bounce rounded-full"></div>
              </div>
            </div>

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
              Anuluj Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
