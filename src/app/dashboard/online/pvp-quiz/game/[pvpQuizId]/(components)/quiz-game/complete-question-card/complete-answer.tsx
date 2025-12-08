import type { api } from "convex/_generated/api"
import type { QuizAnswersType } from "convex/online/pvp_quiz/helpers"
import type { FunctionReturnType } from "convex/server"
import Image from "next/image"
import MarkdownRenderer from "~/components/markdown-rendered"
import { Badge } from "~/components/ui/badge"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { cn, getFileUrl } from "~/lib/utils"
import type { CompleteQuestionProps } from "./complete-question"

export default function Answer({
  answer,
  questionComponentProps,
  usersDataQuery,
}: {
  answer: QuizAnswersType
  questionComponentProps: CompleteQuestionProps
  usersDataQuery:
    | FunctionReturnType<typeof api.online.pvp_quiz.query.parseUsersAnswersIds>
    | null
    | undefined
}) {
  const listOfOtherUsersThatSelectedThisAnswer =
    usersDataQuery?.otherUsersAnswersData.filter((item) => {
      if (
        item.userAnswerData.filter((a) => a.answerDoc._id === answer._id)
          .length > 0
      ) {
        return true
      }
      return false
    })

  const isThereAnyOtherUserAnswer =
    listOfOtherUsersThatSelectedThisAnswer &&
    listOfOtherUsersThatSelectedThisAnswer?.length > 0

  const currentUserProfile =
    questionComponentProps.currentUserQuizData?.userProfile

  const didCurrentUserSelectThisAnswer =
    usersDataQuery?.currentUserData[0]?.userAnswerData
      .map((a) => a.answerDoc._id)
      .includes(answer._id)

  const shouldShowCorrectAnswer =
    answer.isCorrect &&
    questionComponentProps.nonInteractive &&
    questionComponentProps.showCorrectAnswer

  const shouldIndicateBadUserAnswer =
    (questionComponentProps.nonInteractive &&
      !answer.isCorrect &&
      didCurrentUserSelectThisAnswer) ||
    isThereAnyOtherUserAnswer

  const answerAttachment = getFileUrl(answer.attachmentId, "image")?.raw.href

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
        shouldIndicateBadUserAnswer && "bg-destructive/10 border-destructive",
        !questionComponentProps.nonInteractive && "cursor-pointer",

        shouldShowCorrectAnswer &&
          "border-green-500 bg-green-500/10 text-green-500",
      )}
    >
      {didCurrentUserSelectThisAnswer && currentUserProfile && (
        <Badge className="absolute -top-3 -left-2">{"Twoja odpowiedź"}</Badge>
      )}
      <div className={cn(`w-full flex-row items-center justify-center`)}>
        <div className={`flex w-full flex-row items-center justify-between`}>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <p className="text-xl">{answer.label}</p>
              <span className="text-foreground text-md leading-relaxed text-pretty">
                <MarkdownRenderer
                  markdownText={answer.content}
                  textSize="prose-md"
                />
              </span>
            </div>

            {answerAttachment && (
              <div className="mx-auto max-w-md overflow-hidden rounded-xl md:max-w-2xl">
                <div className="md:flex">
                  <div className="relative mx-auto flex max-h-[36rem] min-h-[16rem] w-full max-w-xl min-w-[16rem] items-center justify-center overflow-hidden rounded-lg">
                    <Image
                      alt="Obraz do pytania"
                      fill
                      src={answerAttachment}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {questionComponentProps.nonInteractive && (
            <div
              className={cn(`flex flex-row items-center justify-center gap-2`)}
            >
              {didCurrentUserSelectThisAnswer && currentUserProfile && (
                <ActivityStatusAvatar userToShow={currentUserProfile} />
              )}

              {isThereAnyOtherUserAnswer &&
                listOfOtherUsersThatSelectedThisAnswer.map((item) => (
                  <ActivityStatusAvatar
                    userToShow={item.userProfile}
                    key={crypto.randomUUID()}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
