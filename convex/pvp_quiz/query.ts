import { ConvexError, v } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

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

    console.log({ quiz })

    console.log({ currentUserId })
    if (
      currentUserId !== quiz.creatorUserId &&
      currentUserId !== quiz.opponentUserId
    ) {
      const errMessage = "Nie nie posiadasz uprawnien do tej bitwy!"
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    const creatorUser = await ctx.db.get(quiz.creatorUserId)
    const opponentUser = await ctx.db.get(quiz.opponentUserId)

    if (!creatorUser || !opponentUser) {
      const errMessage = "Nie znaleziono profilu uczestnika bitwy!"
      console.error("Creator Id - ", quiz.creatorUserId)
      console.error("Opponent Id - ", quiz.opponentUserId)
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    return {
      ...quiz,
      creatorUser,
      opponentUser,
    }
  },
})
