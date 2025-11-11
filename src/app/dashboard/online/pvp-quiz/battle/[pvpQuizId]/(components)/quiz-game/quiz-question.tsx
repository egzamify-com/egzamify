import type { Dispatch, SetStateAction } from "react"
import QuizAnswer from "./quiz-answer"
import type { QuizGameState, QuizQuestionType } from "./quiz-game"

export default function QuizQuestion({
  question,
  setQuizGameState,
}: {
  question: QuizQuestionType
  setQuizGameState: Dispatch<SetStateAction<QuizGameState>>
}) {
  return (
    <div className="flex flex-col gap-10 border border-blue-500">
      <h1>{question.content}</h1>
      {question.answers.map((answer) => (
        <QuizAnswer
          key={crypto.randomUUID()}
          {...{ question, answer, setQuizGameState }}
        />
      ))}
    </div>
  )
}
