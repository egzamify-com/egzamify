import type { Doc } from "convex/_generated/dataModel"
import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"
import { vv } from "../schema"
import {
  authUserToAccessQuizOrThrow,
  calcQuizScore,
  calcQuizTime,
  generateQuizProperties,
  getQuizOrThrow,
  getRandomQuestionsIds,
  insertQuizAnswers,
  quizGameStateValidator,
} from "./helpers"

export const createPvpQuiz = mutation({
  args: {
    opponentUserId: v.id("users"),
    quizQualificationId: v.id("qualifications"),
    questionCount: v.number(),
  },
  handler: async (
    ctx,
    { opponentUserId, quizQualificationId, questionCount },
  ) => {
    const user = await getUserProfileOrThrow(ctx)

    const randomQuizQuestionsIds = await getRandomQuestionsIds(
      quizQualificationId,
      questionCount,
      ctx,
    )

    const quizId = await ctx.db.insert("pvpQuizzes", {
      status: "waiting_for_oponent_accept",
      opponentUserId,
      creatorUserId: user._id,
      quizQualificationId,
      quizQuestionsIds: randomQuizQuestionsIds,
    })

    return quizId.toString()
  },
})

export const submitQuiz = mutation({
  args: { quizId: v.id("pvpQuizzes"), quizGameState: quizGameStateValidator },
  handler: async (ctx, { quizId, quizGameState }) => {
    const currentUserId = await getUserIdOrThrow(ctx)

    const quiz = await getQuizOrThrow(ctx, quizId)

    await authUserToAccessQuizOrThrow(currentUserId, quiz)

    const submittedAt = Date.now()

    const nestedUserAnswerIdsFromQuiz = await insertQuizAnswers(
      ctx,
      quizGameState,
      currentUserId,
    )

    const allUserAnswersIds = nestedUserAnswerIdsFromQuiz.flatMap((a) => a)

    const newPlayerData: Doc<"pvpQuizzes">["creatorData"] = {
      submittedAt,
      status: "done",
      answersIds: allUserAnswersIds,
      score: calcQuizScore(quizGameState),
      time: calcQuizTime(quiz, submittedAt),
    }

    const isCurrentUserQuizCreator = currentUserId === quiz.creatorUserId

    const { newDataToInsert, winner, newQuizStatus } = (() => {
      if (isCurrentUserQuizCreator) {
        return generateQuizProperties(
          quiz,
          newPlayerData,
          "creatorData",
          isCurrentUserQuizCreator,
        )
      } else {
        return generateQuizProperties(
          quiz,
          newPlayerData,
          "opponentData",
          isCurrentUserQuizCreator,
        )
      }
    })()

    await ctx.db.patch(quizId, {
      ...newDataToInsert,
      status: newQuizStatus,
      winnerUserId: winner?.winnerUserId,
      winnerType: winner?.winnerType,
    })
  },
})

export const updateQuizStatus = mutation({
  args: {
    quizId: v.id("pvpQuizzes"),
    newStatus: vv.doc("pvpQuizzes").fields.status,
  },
  handler: async (ctx, { quizId, newStatus }) => {
    const quiz = await ctx.db.get(quizId)
    if (!quiz) {
      console.error("Nie znaleziono quizu")
      throw new ConvexError("Nie znaleziono quizu")
    }

    authUserToAccessQuizOrThrow(await getUserIdOrThrow(ctx), quiz)

    await ctx.db.patch(quiz._id, { status: newStatus })
  },
})

export const deleteDeclinedQuiz = mutation({
  args: { quizId: v.id("pvpQuizzes") },
  handler: async (ctx, { quizId }) => {
    const quiz = await getQuizOrThrow(ctx, quizId)
    authUserToAccessQuizOrThrow(await getUserIdOrThrow(ctx), quiz)

    if (quiz.status !== "opponent_declined") {
      throw new ConvexError("Nie mozna usunac aktywnego quizu")
    }

    await ctx.db.delete(quizId)
  },
})
