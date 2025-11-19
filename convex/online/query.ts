import { asyncMap } from "convex-helpers"
import { paginationOptsValidator } from "convex/server"
import { query } from "../_generated/server"

export const listMyOnlineActivity = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const quizList = await ctx.db
      .query("pvpQuizzes")
      .order("desc")
      .paginate(paginationOpts)

    const activityList = await asyncMap(quizList.page, async (quiz) => {
      const creatorUser = await ctx.db.get(quiz.creatorUserId)
      if (!creatorUser) return null
      const opponentUser = await ctx.db.get(quiz.opponentUserId)
      if (!opponentUser) return null
      return {
        quiz,
        users: {
          creatorUser,
          opponentUser,
        },
      }
    })

    return {
      ...quizList,
      page: activityList.filter((a) => a !== null),
    }
  },
})
