import type { VariantProps } from "class-variance-authority"
import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { Calendar, Check, ListIcon } from "lucide-react"
import type { ReactNode } from "react"
import MarkdownRenderer from "~/components/markdown-rendered"
import { Badge, type badgeVariants } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { cn } from "~/lib/utils"
import ExplainQuestionBtn from "./explain-question-btn"

export type FullQuestionPlayerData = {
  userAnswersIds: Id<"userAnswers">[] | undefined
  userProfile: Doc<"users"> | null
}

export type CompleteQuestionCardProps = {
  question: Doc<"questions">
  answers: QuizAnswersType[]
  nonInteractive?: boolean
  showCorrectAnswer?: boolean
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
  showExplanationBtn?: boolean
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
            <CardTitle>
              <div
                className={cn(
                  "text-muted-foreground flex flex-col items-start justify-start gap-2 text-sm font-medium",
                )}
              >
                {!props.questionAdditionalMetadata?.questionNumber &&
                !props.showExplanationBtn ? null : (
                  <div className="flex w-full flex-row items-center justify-between">
                    {props.questionAdditionalMetadata?.questionNumber && (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <ListIcon size={16} />
                        Pytanie{" "}
                        {props.questionAdditionalMetadata?.questionNumber}
                      </div>
                    )}
                    <div>
                      {props.showExplanationBtn && (
                        <ExplainQuestionBtn
                          {...{
                            question: props.question,
                            answers: props.answers,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
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
            </CardTitle>
          )}
          <CardDescription>
            <div className="flex items-start justify-start">
              <MarkdownRenderer
                markdownText={props.question.content}
                textSize="prose-lg"
              />
            </div>
          </CardDescription>
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
  const userQuery = useQuery(api.users.query.getCurrentUser)
  function makeDidUserSelectThisAnswer(userData: Doc<"answers">[] | undefined) {
    return userData?.map((a) => a._id).includes(answer._id)
  }

  const { data } = useQuery(api.pvp_quiz.query.getAnswersFromUserAnswers, {
    currentUserAnswersIds:
      questionComponentProps.currentUserQuizData?.userAnswersIds,
    otherUserAnswersIds:
      questionComponentProps.otherUserQuizData?.userAnswersIds,
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

  const shouldShowCorrectAnswer =
    answer.isCorrect &&
    questionComponentProps.nonInteractive &&
    questionComponentProps.showCorrectAnswer

  const shouldIndicateBadUserAnswer =
    questionComponentProps.nonInteractive &&
    !answer.isCorrect &&
    (didCurrentUserSelectThisAnswer || didOtherUserSelectThisAnswer)

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
        `border-border bg-card hover:border-foreground/50 relative flex w-full cursor-auto flex-row items-center justify-between gap-2 rounded-lg border p-4 text-left transition-all ease-in-out`,
        answer.isSelected &&
          !questionComponentProps.nonInteractive &&
          "bg-muted",
        shouldShowCorrectAnswer &&
          "border-green-500 bg-green-500/10 text-green-500",
        shouldIndicateBadUserAnswer && "bg-destructive/10 border-destructive",
        !questionComponentProps.nonInteractive && "cursor-pointer",
      )}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-start gap-2">
          {didCurrentUserSelectThisAnswer && (
            <Badge className="-top-3">{"Twoja odpowiedź"}</Badge>
          )}
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
        {shouldShowCorrectAnswer && <Check />}
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
