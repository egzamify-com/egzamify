import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { Check } from "lucide-react"
import MarkdownRenderer from "~/components/markdown-rendered"
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
  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          {props.showQuestionMetadata && (
            <CardDescription>
              <div className="flex items-center gap-4">
                {props.questionMetadata?.questionNumber && (
                  <div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Pytanie {props.questionMetadata?.questionNumber}
                    </span>
                  </div>
                )}
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
  questionComponentProps: FullQuestionCardProps
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
      {showCorrectAnswer && <Check />}
    </div>
  )
}
