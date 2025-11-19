import { asyncMap } from "convex-helpers"
import type { Doc, Id } from "convex/_generated/dataModel"
import type { MutationCtx, QueryCtx } from "convex/_generated/server"
import { ConvexError, v, type Infer } from "convex/values"
import { vv } from "../../schema"

export const quizAnswerValidator = v.object({
  ...vv.doc("answers").fields,
  isSelected: v.boolean(),
})
export type QuizAnswersType = Infer<typeof quizAnswerValidator>

export const quizQuestionValidator = v.object({
  ...vv.doc("questions").fields,
  answers: v.array(quizAnswerValidator),
})
export type QuizQuestionType = Infer<typeof quizQuestionValidator>

export const quizGameStateValidator = v.array(quizQuestionValidator)
export type QuizGameState = Infer<typeof quizGameStateValidator>

export async function getRandomQuestionsIds(
  qualificationId: Id<"qualifications">,
  questionCount: number,
  ctx: QueryCtx,
) {
  const allQuestions = await ctx.db
    .query("questions")
    .withIndex("by_qualification", (q) =>
      q.eq("qualificationId", qualificationId),
    )
    .collect()

  const allQuestionsIds = allQuestions.map((item) => item._id)

  if (allQuestionsIds.length < questionCount) {
    console.warn(
      `Only ${allQuestions.length} questions available, requested ${questionCount}. Returning all.`,
    )
    return allQuestionsIds
  }

  const shuffledIds = shuffleArray(allQuestionsIds)

  const randomQuestionsIds = shuffledIds.slice(0, questionCount)

  return randomQuestionsIds
}

function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array passed in
  const shuffled = [...array]
  let currentIndex = shuffled.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // @ts-expect-error fjkdsl
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ]
  }

  return shuffled
}

export async function authUserToAccessQuizOrThrow(
  currentUserId: Id<"users">,
  quiz: Doc<"pvpQuizzes">,
) {
  if (
    currentUserId !== quiz.creatorUserId &&
    currentUserId !== quiz.opponentUserId
  ) {
    const errMessage = "Nie nie posiadasz uprawnien do tej bitwy!"
    console.error(errMessage)
    throw new ConvexError(errMessage)
  }
}

export async function getQuizOrThrow(ctx: QueryCtx, quizId: Id<"pvpQuizzes">) {
  const quiz = await ctx.db.get(quizId)
  if (!quiz) {
    const errMess = "Nie znaleziono quizu!"
    console.error(errMess)
    throw new ConvexError(errMess)
  }
  return quiz
}

export async function insertQuizAnswers(
  ctx: MutationCtx,
  quizGameState: QuizGameState,
  currentUserId: Id<"users">,
) {
  const result = await asyncMap(quizGameState, async (question) => {
    const answerIdsForQuestion = await asyncMap(
      question.answers,
      async (answer) => {
        if (!answer.isSelected) return null
        return await insertQuizAnswerOrThrow(ctx, answer, currentUserId)
      },
    )
    return answerIdsForQuestion.filter((a) => a !== null)
  })
  return result.flatMap((a) => a)
}

export async function insertQuizAnswerOrThrow(
  ctx: MutationCtx,
  answer: QuizAnswersType,
  userId: Id<"users">,
) {
  try {
    const userAnswerId = await ctx.db.insert("userAnswers", {
      userId,
      isCorrect: answer.isCorrect,
      answerId: answer._id,
      questionId: answer.questionId,
    })
    return userAnswerId
  } catch (e) {
    const errMess = "Nie udalo sie zapisac odpowiedzi"
    console.error(errMess)
    console.error(e)
    throw new ConvexError(errMess)
  }
}

export function calcQuizScore(quizGameState: QuizGameState) {
  const allAnswers = quizGameState
    .map((question) => question.answers)
    .flatMap((a) => a)

  const corrects = allAnswers.filter((answer) => {
    if (answer.isCorrect && answer.isSelected) {
      return true
    }
    return false
  })

  return corrects.length
}

export function calcQuizTime(startedAt: number, submittedAt: number) {
  const timeSpentOnQuiz = submittedAt - startedAt
  return timeSpentOnQuiz
}

export function calcQuizWinner(quiz: Doc<"pvpQuizzes">): {
  winnerType: Doc<"pvpQuizzes">["winnerType"]
  winnerUserId: Doc<"pvpQuizzes">["winnerUserId"]
} {
  if (
    quiz.creatorData?.score === undefined ||
    quiz.opponentData?.score === undefined ||
    quiz.creatorData?.time === undefined ||
    quiz.opponentData?.time === undefined
  ) {
    console.log("no data found (?)")
    console.log("creator score - ", quiz.creatorData?.score)
    console.log("opp score - ", quiz.opponentData?.score)

    console.log("creator time - ", quiz.creatorData?.time)
    console.log("opp time - ", quiz.opponentData?.time)
    return { winnerType: undefined, winnerUserId: undefined }
  }

  if (quiz.creatorData?.score === quiz.opponentData?.score) {
    console.log("TIE, have to backup to time")
    console.log("creator score - ", quiz.creatorData?.score)
    console.log("opp score - ", quiz.opponentData?.score)

    if (quiz.creatorData?.time < quiz.opponentData?.time) {
      console.log("CREATOR WIN BY TIME")

      console.log("creator time - ", quiz.creatorData?.time)
      console.log("opp time - ", quiz.opponentData?.time)
      return { winnerType: "by_time", winnerUserId: quiz.creatorUserId }
    }

    if (quiz.creatorData?.time > quiz.opponentData?.time) {
      console.log("OPP WIN BY TIME")

      console.log("creator time - ", quiz.creatorData?.time)
      console.log("opp time - ", quiz.opponentData?.time)
      return { winnerType: "by_time", winnerUserId: quiz.opponentUserId }
    }

    return { winnerType: undefined, winnerUserId: undefined }
  }

  if (quiz.creatorData?.score > quiz.opponentData?.score) {
    console.log("CREATOR WIN")
    console.log("creator score - ", quiz.creatorData?.score)
    console.log("opp score - ", quiz.opponentData?.score)
    return { winnerType: "by_score", winnerUserId: quiz.creatorUserId }
  }

  if (quiz.creatorData?.score < quiz.opponentData?.score) {
    console.log("OPP WIN")
    console.log("creator score - ", quiz.creatorData?.score)
    console.log("opp score - ", quiz.opponentData?.score)

    return { winnerType: "by_score", winnerUserId: quiz.opponentUserId }
  }
  return { winnerType: undefined, winnerUserId: undefined }
}
