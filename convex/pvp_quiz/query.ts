import { asyncMap } from "convex-helpers"
import { ConvexError, v } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import { authUserToAccessQuizOrThrow } from "./helpers"

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

    return {
      ...quiz,
      creatorUser,
      opponentUser,
      quizQuestions: quizQuestions.filter((a) => a !== null),
    }
  },
})
