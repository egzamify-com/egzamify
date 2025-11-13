import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { Check } from "lucide-react"
import { Card } from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { cn } from "~/lib/utils"

export type FullQuestionPlayerData = {
  userData: Doc<"pvpQuizzes">["creatorData"] | null
  userProfile: Doc<"users"> | null
}

type FullQuestionCardProps = {
  question: Doc<"questions">
  answers: QuizAnswersType[]
  nonInteractive?: boolean
  handleSelectingNewAnswer?: (
    answerSelected: QuizAnswersType,
    question: Doc<"questions">,
  ) => void
  showQuestionMetadata?: boolean
  questionMetadata?: {
    questionNumber?: number
  }
  currentUserQuizData?: FullQuestionPlayerData
  otherUserQuizData?: FullQuestionPlayerData
}

export default function FullQuestionCard(props: FullQuestionCardProps) {
  const currentUserProfile = props.currentUserQuizData?.userProfile
  const otherUserProfile = props.otherUserQuizData?.userProfile

  const { data, isPending, error } = useQuery(
    api.pvp_quiz.query.getAnswersFromUserAnswers,
    {
      currentUserAnswersIds: props.currentUserQuizData?.userData?.answersIds,
      otherUserAnswersIds: props.otherUserQuizData?.userData?.answersIds,
    },
  )

  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {props.showQuestionMetadata && (
              <div className="mb-2 flex items-center gap-4">
                {props.questionMetadata?.questionNumber && (
                  <span className="text-muted-foreground text-sm font-medium">
                    Pytanie {props.questionMetadata?.questionNumber}
                  </span>
                )}
              </div>
            )}
            <h4 className="text-foreground text-lg leading-relaxed font-medium text-balance">
              {props.question.content}
            </h4>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-2">
          {props.answers.map((answer) => {
            const showCorrectAnswer = answer.isCorrect && props.nonInteractive

            const didCurrentUserSelectThisAnswer = data?.currentUsers
              .map((a) => a._id)
              .includes(answer._id)

            const didOtherUserSelectThisAnswer = data?.otherUsers
              .map((a) => a._id)
              .includes(answer._id)

            return (
              <div
                key={crypto.randomUUID()}
                onClick={() => {
                  if (props.nonInteractive) return
                  props.handleSelectingNewAnswer?.(answer, props.question)
                }}
                className={cn(
                  `border-border bg-card relative flex w-full cursor-auto flex-row items-center justify-between gap-2 rounded-lg border p-4 text-left transition-all ease-in-out hover:translate-x-2`,
                  answer.isSelected && !props.nonInteractive && "bg-muted",
                  showCorrectAnswer &&
                    "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/10",
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm leading-relaxed text-pretty">
                      <p>{answer.content}</p>
                    </span>
                  </div>
                  {props.nonInteractive &&
                    (didCurrentUserSelectThisAnswer ||
                      didOtherUserSelectThisAnswer) && (
                      <div className={`flex flex-row gap-2`}>
                        {didCurrentUserSelectThisAnswer &&
                          currentUserProfile && (
                            <AvatarBadge user={currentUserProfile} />
                          )}

                        {didOtherUserSelectThisAnswer && otherUserProfile && (
                          <AvatarBadge user={otherUserProfile} />
                        )}
                      </div>
                    )}
                </div>
                {showCorrectAnswer && <Check />}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
function AvatarBadge({ user }: { user: Doc<"users"> }) {
  return <ActivityStatusAvatar userToShow={user} />
}
