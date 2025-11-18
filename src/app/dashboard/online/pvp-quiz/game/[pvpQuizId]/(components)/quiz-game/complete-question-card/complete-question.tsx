import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { Calendar } from "lucide-react"
import Image from "next/image"
import MarkdownRenderer from "~/components/markdown-rendered"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { cn, getFileUrl } from "~/lib/utils"
import Answer from "./complete-answer"
import ExplainQuestionBtn from "./explain-question-btn"
import QuestionBadge from "./question-badge"

export type CompleteQuestionPlayerData = {
  userAnswersIds: Id<"userAnswers">[] | undefined
  userProfile: Doc<"users"> | undefined
}

export type CompleteQuestionProps = {
  question: Doc<"questions">
  answers: QuizAnswersType[]
  nonInteractive?: boolean
  showCorrectAnswer?: boolean
  handleSelectingNewAnswer?: (
    answerSelected: QuizAnswersType,
    question: Doc<"questions">,
  ) => Promise<void>
  showQuestionMetadata?: boolean
  questionAdditionalMetadata?: {
    questionNumber?: number
  }
  currentUserQuizData?: CompleteQuestionPlayerData
  otherUsersQuizData?: CompleteQuestionPlayerData[]
  showExplanationBtn?: boolean
}

export default function CompleteQuestion(props: CompleteQuestionProps) {
  const questionAttachment = getFileUrl(
    props.question.attachmentId,
    "image",
  )?.raw

  const questionContentToRender =
    props.showQuestionMetadata &&
    props.questionAdditionalMetadata?.questionNumber
      ? `${props.questionAdditionalMetadata.questionNumber}.   ${props.question.content}`
      : `${props.question.content}`

  const qualificationQuery = useQuery(api.teoria.query.getQualificationFromId, {
    qualificationId: props.question.qualificationId,
  })

  const usersDataQuery = useQuery(api.pvp_quiz.query.parseUsersAnswersIds, {
    currentUserAnswersIds: [
      {
        userProfile:
          props.currentUserQuizData?.userProfile === null
            ? undefined
            : props.currentUserQuizData?.userProfile,
        userAnswersIds: props.currentUserQuizData?.userAnswersIds,
      },
    ],
    otherUsersAnswersIds: props.otherUsersQuizData,
  })

  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden">
        <CardHeader className="gap-2">
          {props.showQuestionMetadata && (
            <CardTitle>
              <div
                className={cn(
                  "text-muted-foreground flex w-full flex-row items-center justify-between gap-2 text-sm font-medium",
                )}
              >
                {/* {props.questionAdditionalMetadata?.questionNumber && ( */}
                {/*   <div className="flex flex-row items-center justify-center gap-2"> */}
                {/*     <ListIcon size={16} /> */}
                {/*     Pytanie {props.questionAdditionalMetadata?.questionNumber} */}
                {/*   </div> */}
                {/* )} */}
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
                        {"#"}
                        {tag}
                      </QuestionBadge>
                    )
                  })}
                </div>

                {!props.questionAdditionalMetadata?.questionNumber &&
                !props.showExplanationBtn ? null : (
                  <div className="flex flex-row items-center justify-between gap-4">
                    {props.showExplanationBtn && (
                      <ExplainQuestionBtn
                        {...{
                          question: props.question,
                          answers: props.answers,
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </CardTitle>
          )}
          <CardDescription className="space-y-4">
            <div className="flex items-start justify-start">
              <MarkdownRenderer
                markdownText={questionContentToRender}
                textSize="prose-lg"
              />
            </div>
            {questionAttachment && (
              <div className="flex w-full flex-row items-center justify-center">
                <Image
                  alt="Obraz do pytania"
                  width={400}
                  height={200}
                  src={questionAttachment.href}
                  className="shadow-background w-3/5 rounded-2xl border shadow-2xl"
                />
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start gap-2">
          {props.answers.map((answer) => (
            <Answer
              key={crypto.randomUUID()}
              {...{
                questionComponentProps: props,
                answer,
                usersDataQuery: usersDataQuery.data,
              }}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
