import type { Dispatch, SetStateAction } from "react"
import type {
  QuizAnswerType,
  QuizGameState,
  QuizQuestionType,
} from "./quiz-game"

export default function QuizAnswer({
  question,
  answer,
  setQuizGameState,
}: {
  question: QuizQuestionType
  answer: QuizAnswerType
  setQuizGameState: Dispatch<SetStateAction<QuizGameState>>
}) {
  return (
    <p
      className="border border-red-500"
      onClick={() => {
        setQuizGameState((prevQuizGameState) => {
          if (!prevQuizGameState) {
            return [
              {
                ...question,
                answers: [{ ...answer, isSelected: true }],
              },
            ] as QuizGameState
          }

          const newQuizState: QuizGameState = prevQuizGameState.map((q) => {
            if (q._id === question._id) {
              const updatedAnswers = q.answers.map((a) => {
                if (a._id === answer._id) {
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
      }}
    >
      {answer.content}
      {answer.isSelected && "selected"}
    </p>
  )
}
