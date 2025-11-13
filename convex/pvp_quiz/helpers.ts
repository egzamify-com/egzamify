import { asyncMap } from "convex-helpers"
import type { Doc, Id } from "convex/_generated/dataModel"
import type { MutationCtx, QueryCtx } from "convex/_generated/server"
import { ConvexError, v, type Infer } from "convex/values"
import { vv } from "../schema"

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
  return await asyncMap(quizGameState, async (question) => {
    const answerIdsForQuestion = await asyncMap(
      question.answers,
      async (answer) => {
        if (!answer.isSelected) return null
        return await insertQuizAnswerOrThrow(ctx, answer, currentUserId)
      },
    )
    return answerIdsForQuestion.filter((a) => a !== null)
  })
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

export function calcQuizTime(quiz: Doc<"pvpQuizzes">, submittedAt: number) {
  const timeSpentOnQuiz = submittedAt - (quiz.startedAt ?? quiz._creationTime)
  return timeSpentOnQuiz
}

export function workOutNewQuizStatus(
  quiz: Doc<"pvpQuizzes">,
  newDataToInsert: Doc<"pvpQuizzes">,
): Doc<"pvpQuizzes">["status"] {
  const isAnyNewDataIncoming = newDataToInsert !== undefined

  const isAnyPlayerDataAlreadyInDb =
    quiz.opponentData !== undefined || quiz.creatorData !== undefined

  const shouldSetQuizToCompleted =
    isAnyPlayerDataAlreadyInDb && isAnyNewDataIncoming

  if (shouldSetQuizToCompleted) {
    return "quiz_completed"
  }

  return "quiz_pending"
}

export function calcWinner(
  quiz: Doc<"pvpQuizzes">,
  newDataToInsert: Doc<"pvpQuizzes">,
  isCurrentUserQuizCreator: boolean,
):
  | {
      winnerUserId: Doc<"pvpQuizzes">["winnerUserId"]
      winnerType: Doc<"pvpQuizzes">["winnerType"]
    }
  | undefined {
  let creatorScore: number | undefined = 0
  let opponentScore: number | undefined = 0

  let creatorTime: number | undefined = 0
  let opponentTime: number | undefined = 0

  if (isCurrentUserQuizCreator) {
    console.log("winner coming from creator")
    creatorScore = newDataToInsert.creatorData?.score
    opponentScore = quiz.opponentData?.score

    creatorTime = newDataToInsert.creatorData?.time
    opponentTime = quiz.opponentData?.time
  } else if (!isCurrentUserQuizCreator) {
    console.log("winner coming from opponent")
    creatorScore = quiz.creatorData?.score
    opponentScore = newDataToInsert.opponentData?.score

    creatorTime = quiz.creatorData?.time
    opponentTime = newDataToInsert.opponentData?.time
  }

  if (!creatorScore || !opponentScore) {
    console.log("no creator or oppoent score found")
    console.log({ creatorScore })
    console.log({ opponentScore })
    return undefined
  }

  if (creatorScore > opponentScore) {
    console.log("creator win")
    return { winnerUserId: quiz.creatorUserId, winnerType: "by_score" }
  } else if (creatorScore < opponentScore) {
    console.log("opp win")
    return { winnerUserId: quiz.opponentUserId, winnerType: "by_score" }
  } else {
    console.log("remis, checking time")

    if (!creatorTime || !opponentTime) {
      console.log("no creator or oppoent time found")
      console.log({ creatorTime })
      console.log({ opponentTime })
      return undefined
    }

    if (creatorTime < opponentTime) {
      console.log("creator win by time")
      return { winnerUserId: quiz.creatorUserId, winnerType: "by_time" }
    } else if (creatorTime > opponentTime) {
      console.log("opp win by time")
      return { winnerUserId: quiz.opponentUserId, winnerType: "by_time" }
    }
  }
  console.log("no ifs hit, default undefined returned")
  return undefined
}

export function generateQuizProperties(
  quiz: Doc<"pvpQuizzes">,
  newPlayerData: Doc<"pvpQuizzes">["creatorData"],
  // TODO: infer this from schema to make it better
  newPlayerDataKey: "creatorData" | "opponentData",
  isCurrentUserQuizCreator: boolean,
) {
  const newDataToInsert = { ...quiz, [newPlayerDataKey]: newPlayerData }
  const newQuizStatus = workOutNewQuizStatus(quiz, newDataToInsert)

  const winner =
    newQuizStatus === "quiz_completed"
      ? calcWinner(quiz, newDataToInsert, isCurrentUserQuizCreator)
      : undefined

  console.log(
    isCurrentUserQuizCreator
      ? "in current user = creator"
      : "in current user != creator",
  )

  return { newDataToInsert, newQuizStatus, winner }
}
