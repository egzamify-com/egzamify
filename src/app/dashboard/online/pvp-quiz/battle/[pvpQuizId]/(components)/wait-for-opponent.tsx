import type { PvpQuizQueryReturnType } from "../page"

export default function WaitForOpponent({
  quizData,
}: {
  quizData: PvpQuizQueryReturnType
}) {
  return (
    <div>
      waiting for accept from opp
      <p>the opp: {quizData.opponentUser.username}</p>
    </div>
  )
}
