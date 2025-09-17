import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

export const getStripeCustomerId = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)
    const key = `stripe:user:${userId}`
    const result = await ctx.db
      .query("kv")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first()

    return result?.value
  },
})

export const getUserPendingCredits = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)
    return await ctx.db.get(userId)
  },
})
