import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"

export const createPvpQuiz = mutation({
  args: { opponentUserId: v.id("users") },
  handler: async (ctx, { opponentUserId }) => {
    const user = await getUserProfileOrThrow(ctx)
    const battleId = await ctx.db.insert("pvpQuizzes", {
      status: "waiting_for_oponent_accept",
      opponentUserId,
      creatorUserId: user._id,
    })
    return battleId.toString()
  },
})
