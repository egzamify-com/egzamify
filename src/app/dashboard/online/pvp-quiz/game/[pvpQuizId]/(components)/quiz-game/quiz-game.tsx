import { api } from "convex/_generated/api"
import type { QuizAnswersType, QuizGameState } from "convex/pvp_quiz/helpers"
import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { tryCatch } from "~/lib/tryCatch"
import type { PvpQuizQueryReturnType } from "../../page"
import QuizQuestion from "./quiz-question"
import QuizSubmitted from "./quiz-submitted"

export default function QuizGame({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const [quizGameState, setQuizGameState] = useState<QuizGameState>(
    transformQuizDataToQuizState(quizData),
  )
  console.log({ quizGameState })
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

  return (
    <div>
      {quizGameState.map((question) => {
        return (
          <QuizQuestion
            key={crypto.randomUUID()}
            {...{ question, setQuizGameState }}
          />
        )
      })}
      <Button onClick={async () => await handleSubmitQuiz()}>
        Submit quiz
      </Button>
    </div>
  )
}

function transformQuizDataToQuizState(
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
