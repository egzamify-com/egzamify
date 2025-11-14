import type { VariantProps } from "class-variance-authority"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { Calendar, Check, ListIcon } from "lucide-react"
import type { ReactNode } from "react"
import MarkdownRenderer from "~/components/markdown-rendered"
import { Badge, badgeVariants } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { cn } from "~/lib/utils"

export type FullQuestionPlayerData = {
  userData: Doc<"pvpQuizzes">["creatorData"] | null
  userProfile: Doc<"users"> | null
}

type CompleteQuestionCardProps = {
  question: Doc<"questions">
  answers: QuizAnswersType[]
  nonInteractive?: boolean
  handleSelectingNewAnswer?: (
    answerSelected: QuizAnswersType,
    question: Doc<"questions">,
  ) => void
  showQuestionMetadata?: boolean
  questionAdditionalMetadata?: {
    questionNumber?: number
  }
  currentUserQuizData?: FullQuestionPlayerData
  otherUserQuizData?: FullQuestionPlayerData
}

export default function CompleteQuestionCard(props: CompleteQuestionCardProps) {
  const qualificationQuery = useQuery(api.teoria.query.getQualificationFromId, {
    qualificationId: props.question.qualificationId,
  })

  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden">
        <CardHeader className="gap-2">
          {props.showQuestionMetadata && (
            <CardDescription>
              <div className="text-muted-foreground flex flex-col items-start justify-start gap-0 text-sm font-medium">
                <div className="flex w-full flex-row items-start justify-between">
                  {props.questionAdditionalMetadata?.questionNumber && (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <ListIcon size={16} />
                      Pytanie {props.questionAdditionalMetadata?.questionNumber}
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-2">
                  <QuestionBadge>
                    <Calendar size={16} />
                    {props.question.month} {props.question.year}
                  </QuestionBadge>
                  {qualificationQuery.data && (
                    <QuestionBadge>
                      {qualificationQuery.data.name}
                    </QuestionBadge>
                  )}
                  {props.question.tags?.map((tag) => {
                    return (
                      <QuestionBadge
                        key={crypto.randomUUID()}
                        variant={"secondary"}
                      >
                        {tag}
                      </QuestionBadge>
                    )
                  })}
                </div>
              </div>
            </CardDescription>
          )}
          <CardTitle>
            <div className="flex items-start justify-start">
              <MarkdownRenderer
                markdownText={props.question.content}
                textSize="prose-lg"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start gap-2">
          {props.answers.map((answer) => (
            <Answer
              key={crypto.randomUUID()}
              {...{ questionComponentProps: props, answer }}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Answer({
  answer,
  questionComponentProps,
}: {
  answer: QuizAnswersType
  questionComponentProps: CompleteQuestionCardProps
}) {
  function makeDidUserSelectThisAnswer(userData: Doc<"answers">[] | undefined) {
    return userData?.map((a) => a._id).includes(answer._id)
  }

  const { data } = useQuery(api.pvp_quiz.query.getAnswersFromUserAnswers, {
    currentUserAnswersIds:
      questionComponentProps.currentUserQuizData?.userData?.answersIds,
    otherUserAnswersIds:
      questionComponentProps.otherUserQuizData?.userData?.answersIds,
  })

  const currentUserProfile =
    questionComponentProps.currentUserQuizData?.userProfile

  const otherUserProfile = questionComponentProps.otherUserQuizData?.userProfile

  const didCurrentUserSelectThisAnswer = makeDidUserSelectThisAnswer(
    data?.currentUsers,
  )

  const didOtherUserSelectThisAnswer = makeDidUserSelectThisAnswer(
    data?.otherUsers,
  )

  const showCorrectAnswer =
    answer.isCorrect && questionComponentProps.nonInteractive

  return (
    <div
      onClick={() => {
        if (questionComponentProps.nonInteractive) return
        questionComponentProps.handleSelectingNewAnswer?.(
          answer,
          questionComponentProps.question,
        )
      }}
      className={cn(
        `border-border bg-card hover:border-foreground/50 relative flex w-full cursor-auto cursor-pointer flex-row items-center justify-between gap-2 rounded-lg border p-4 text-left transition-all ease-in-out`,
        answer.isSelected &&
          !questionComponentProps.nonInteractive &&
          "bg-muted",
        showCorrectAnswer &&
          "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/10",
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-md leading-relaxed text-pretty">
            <MarkdownRenderer
              markdownText={answer.content}
              textSize="prose-md"
            />
          </span>
        </div>
        {questionComponentProps.nonInteractive &&
          (didCurrentUserSelectThisAnswer || didOtherUserSelectThisAnswer) && (
            <div className={`flex flex-row gap-2`}>
              {didCurrentUserSelectThisAnswer && currentUserProfile && (
                <ActivityStatusAvatar userToShow={currentUserProfile} />
              )}

              {didOtherUserSelectThisAnswer && otherUserProfile && (
                <ActivityStatusAvatar userToShow={otherUserProfile} />
              )}
            </div>
          )}
      </div>
      <div className="flex flex-row gap-2">
        {showCorrectAnswer && <Check />}
        <p>{answer.label}</p>
      </div>
    </div>
  )
}

function QuestionBadge({
  children,
  variant = "outline",
}: {
  children: ReactNode
  variant?: VariantProps<typeof badgeVariants>["variant"]
}) {
  return (
    <Badge
      variant={variant}
      className="flex flex-row items-center justify-center gap-2 rounded-xl px-3 py-1"
    >
      {children}
    </Badge>
  )
}
