import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import type { QuizAnswersType, QuizGameState } from "convex/pvp_quiz/helpers"
import { useMutation } from "convex/react"
import { Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { tryCatch } from "~/lib/tryCatch"
import type { PvpQuizQueryReturnType } from "../../page"
import FullQuestionCard from "./complete-question-card/complete-question"
import QuizSubmitted from "./quiz-submitted"

export default function QuizGame({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const [quizGameState, setQuizGameState] = useState<QuizGameState>(
    transformQuizDataToQuizState(quizData),
  )
  const submitQuiz = useMutation(api.pvp_quiz.mutate.submitQuiz)
  const [submitStatus, setSubmitStatus] = useState<
    "pending" | "submitted" | "idle"
  >("idle")

  if (submitStatus === "submitted") {
    return <QuizSubmitted />
  }

  async function handleSubmitQuiz() {
    setSubmitStatus("pending")

    const [, err] = await tryCatch(
      submitQuiz({ quizGameState, quizId: quizData._id }),
    )
    if (err) {
      const errMess = "Nie udalo sie przeslac quizu"
      console.error(errMess)
      toast.error(errMess)
      return
    }

    setSubmitStatus("submitted")
    toast.success("Przeslano quiz!")
  }

  async function handleSelectingNewAnswer(
    selectedAnswer: QuizAnswersType,
    question: Doc<"questions">,
  ) {
    setQuizGameState((prevQuizGameState) => {
      if (!prevQuizGameState) {
        return [
          {
            ...question,
            answers: [{ ...selectedAnswer, isSelected: true }],
          },
        ] as QuizGameState
      }

      const newQuizState: QuizGameState = prevQuizGameState.map((q) => {
        if (q._id === question._id) {
          const updatedAnswers = q.answers.map((a) => {
            if (a._id === selectedAnswer._id) {
              return {
                ...a,
                isSelected: true,
              }
            }
            return { ...a, isSelected: false }
          })

          return {
            ...q,
            answers: updatedAnswers,
          }
        }
        return q
      })

      return newQuizState
    })
  }

  return (
    <PageHeaderWrapper>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>
            <h1>Quiz</h1>
          </CardTitle>
          <CardDescription>
            <p>Kwalifikacja: {quizData.quizQualification?.nameLabelCombined}</p>
            <p>Pytania: {quizData.quizQuestionsIds.length}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-col items-center justify-start gap-4">
          <div className="flex w-full flex-col gap-4">
            {quizGameState.map((question, index) => {
              return (
                <FullQuestionCard
                  key={crypto.randomUUID()}
                  {...{
                    questionAdditionalMetadata: {
                      questionNumber: index + 1,
                    },
                    showQuestionMetadata: true,
                    question: question,
                    answers: question.answers,
                    handleSelectingNewAnswer,
                    showLoadingState: true,
                  }}
                />
              )
            })}
          </div>
          <div className="flex w-full flex-row items-center justify-end">
            <Button
              className="w-full"
              onClick={async () => await handleSubmitQuiz()}
            >
              {submitStatus === "pending" && <SpinnerLoading />}
              {submitStatus === "idle" && (
                <>
                  <Send />
                  {"Prześlij quiz"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageHeaderWrapper>
  )
}

export function transformQuizDataToQuizState(
  quizData: PvpQuizQueryReturnType,
): QuizGameState {
  return quizData.quizQuestions.map((question) => {
    const transformedAnswers: QuizAnswersType[] = question.answers.map(
      (answer, index) => {
        return {
          ...answer,
          isSelected: index === 0 ? true : false,
        }
      },
    )
    return {
      ...question,
      answers: transformedAnswers,
    }
  })
}
