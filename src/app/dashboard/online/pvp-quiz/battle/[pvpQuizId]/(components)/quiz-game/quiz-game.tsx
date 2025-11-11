import type { Doc } from "convex/_generated/dataModel"
import { useState } from "react"
import type { PvpQuizQueryReturnType } from "../../page"
import QuizQuestion from "./quiz-question"

export type QuizAnswerType = Doc<"answers"> & {
  isSelected: boolean
}

export type QuizQuestionType = Doc<"questions"> & {
  answers: QuizAnswerType[]
}

export type QuizGameState = QuizQuestionType[]

function transformQuizDataToQuizState(
  quizData: PvpQuizQueryReturnType,
): QuizGameState {
  const result: QuizGameState = quizData.quizQuestions.map((question) => {
    const transformedAnswers = question.answers.map((answer) => {
      return {
        ...answer,
        isSelected: false,
      }
    })

    return {
      ...question,
      answers: transformedAnswers,
    }
  })
  return result
}

export default function QuizGame({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  const [quizGameState, setQuizGameState] = useState<QuizGameState>(
    transformQuizDataToQuizState(quizData),
  )

  console.log({ quizGameState })

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
    </div>
  )
}
