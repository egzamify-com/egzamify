import { asyncMap } from "convex-helpers"
import { paginationOptsValidator } from "convex/server"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

export const listMyOnlineActivity = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const currentUserId = await getUserIdOrThrow(ctx)
    const quizList = await ctx.db
      .query("pvpQuizzes")
      .filter((a) =>
        a.or(
          a.eq(a.field("creatorUserId"), currentUserId),
          a.eq(a.field("opponentUserId"), currentUserId),
        ),
      )
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
