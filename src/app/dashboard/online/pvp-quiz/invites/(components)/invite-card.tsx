import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { motion } from "framer-motion"
import { Calendar, Check, List, X } from "lucide-react"
import { useRouter } from "next/navigation"
import SemanticDate from "~/components/semantic-date"
import { Button } from "~/components/ui/button"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"

interface QuizInviteCardProps {
  userId: Id<"users">
  quizInvite: FunctionReturnType<
    typeof api.pvp_quiz.query.getOnlineInvites
  >[number]
}

export default function QuizInviteCard({
  userId,
  quizInvite,
}: QuizInviteCardProps) {
  const router = useRouter()
  const {
    data: quizCreatorUser,
    isPending,
    error,
  } = useQuery(api.users.query.getUserFromId, { userId })

  const updateQuizStatus = useMutation(api.pvp_quiz.mutate.updateQuizStatus)

  if (isPending) return null
  if (error) return null
  if (!quizCreatorUser) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="from-card via-card to-muted border-border hover:border-primary relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-8 transition-all duration-300 xl:w-1/2"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-30 transition-opacity duration-500">
        <div className="bg-primary/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header with inviter info */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ActivityStatusAvatar userToShow={quizCreatorUser} size={50} />
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Zaproszenie</p>
              <h4 className="text-foreground text-xl font-bold">
                {quizCreatorUser.username}
              </h4>
            </div>
          </div>
        </div>

        {/* Quiz details */}
        <div className="mb-6 flex-1">
          <h3 className="text-foreground mb-4 text-2xl font-bold text-balance">
            Quiz Battle Invitation
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border p-2">
                <List className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Kwalifikacja - {quizInvite.quizQualification?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border p-2">
                <List className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Pytania - {quizInvite.quizQuestionsIds.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border p-2">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <SemanticDate date={quizInvite._creationTime} size="text-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-border/50 flex items-center gap-3 border-t pt-4">
          <Button
            onClick={async () => {
              await updateQuizStatus({
                newStatus: "quiz_pending",
                quizId: quizInvite._id,
              })
              router.push(`/dashboard/online/pvp-quiz/game/${quizInvite._id}`)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 gap-2 font-semibold"
          >
            <Check className="h-5 w-5" />
            Rozpocznij quiz
          </Button>
          <Button
            onClick={async () => {
              await updateQuizStatus({
                newStatus: "opponent_declined",
                quizId: quizInvite._id,
              })
            }}
            variant="outline"
            className="border-border hover:bg-muted text-destructive gap-2 bg-transparent"
          >
            <X className="h-5 w-5" />
            Odrzuc
          </Button>
        </div>
      </div>

      {/* Decorative VS element */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ delay: 0.2 }}
        className="text-foreground pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 text-[140px] font-black select-none"
      >
        VS
      </motion.div>
    </motion.div>
  )
}
