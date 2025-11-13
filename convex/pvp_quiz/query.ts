import { asyncMap } from "convex-helpers"
import { ConvexError, v } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"
import { authUserToAccessQuizOrThrow, getQuizOrThrow } from "./helpers"

export const getPvpQuiz = query({
  args: { pvpQuizId: v.id("pvpQuizzes") },
  handler: async (ctx, { pvpQuizId }) => {
    const currentUserId = await getUserIdOrThrow(ctx)

    const quiz = await ctx.db.get(pvpQuizId)

    if (!quiz) {
      const errMessage = "Nie znaleziono bitwy"
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    await authUserToAccessQuizOrThrow(currentUserId, quiz)

    const creatorUser = await ctx.db.get(quiz.creatorUserId)
    const opponentUser = await ctx.db.get(quiz.opponentUserId)

    if (!creatorUser || !opponentUser) {
      const errMessage = "Nie znaleziono profilu uczestnika bitwy!"
      console.error("Creator Id - ", quiz.creatorUserId)
      console.error("Opponent Id - ", quiz.opponentUserId)
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    const quizQuestions = await asyncMap(
      quiz.quizQuestionsIds,
      async (questionId) => {
        const question = await ctx.db.get(questionId)
        if (!question) return null
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", questionId))
          .collect()
        return {
          ...question,
          answers,
        }
      },
    )

    const quizQualification = await ctx.db.get(quiz.quizQualificationId)

    return {
      ...quiz,
      creatorUser,
      opponentUser,
      quizQuestions: quizQuestions.filter((a) => a !== null),
      quizQualification,
    }
  },
})

export const getUsersFromQuiz = query({
  args: { quizId: v.id("pvpQuizzes") },
  handler: async (ctx, { quizId }) => {
    const currentUser = await getUserProfileOrThrow(ctx)

    const quiz = await getQuizOrThrow(ctx, quizId)

    const winnerUserId = quiz.winnerUserId
    if (!winnerUserId) {
      const errMess = "Nie udalo sie znalesc zwyciezcy!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const winnerUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", winnerUserId))
      .first()

    if (!winnerUser) {
      const errMess = "Nie znaleziono uzytkownika zwyciezcy!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const opponentUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", quiz.opponentUserId))
      .first()

    if (!opponentUser) {
      const errMess = "Nie znaleziono uzytkownika przeciwnika !"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const creatorUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", quiz.creatorUserId))
      .first()

    if (!creatorUser) {
      const errMess = "Nie znaleziono uzytkownika tworcy quizu!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }
    return { currentUser, winnerUser, creatorUser, opponentUser }
  },
})

export const getAnswersFromIdArray = query({
  args: { userAnswersIds: v.array(v.id("userAnswers")) },
  handler: async (ctx, { userAnswersIds }) => {
    const answers = await asyncMap(userAnswersIds, async (userAnswerId) => {
      const userAnswer = await ctx.db.get(userAnswerId)
      if (!userAnswer) return null
      const originalAnswer = await ctx.db.get(userAnswer.questionId)
      if (!originalAnswer) return null
      return { userAnswer, originalAnswer }
    })
    return answers
  },
})

export const getOnlineInvites = query({
  handler: async (ctx) => {
    const currentUserId = await getUserIdOrThrow(ctx)
    const pendingQuizzes = await ctx.db
      .query("pvpQuizzes")
      .withIndex("by_status", (q) =>
        q.eq("status", "waiting_for_oponent_accept"),
      )
      .collect()

    const quizzes = await asyncMap(pendingQuizzes, async (quiz) => {
      return {
        ...quiz,
        quizQualification: await ctx.db.get(quiz.quizQualificationId),
      }
    })

    return quizzes
      .filter((a) => {
        if (a.creatorUserId === currentUserId) {
          return null
        }
        return a
      })
      .filter((a) => a !== null)
  },
})
