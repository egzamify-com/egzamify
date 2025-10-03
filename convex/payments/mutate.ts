import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"

export const storeStripeCustomerId = mutation({
  args: { userId: v.id("users"), customerId: v.string() },
  handler: async (ctx, { userId, customerId }) => {
    await getUserIdOrThrow(ctx)
    const key = `stripe:user:${userId}`
    const value = customerId
    await ctx.db.insert("kv", { key, value })
  },
})

export const storeCustomerData = mutation({
  args: {
    customerId: v.string(),
    sessionId: v.string(),
    customerData: v.string(),
  },
  handler: async (ctx, { customerId, sessionId, customerData }) => {
    // await getUserIdOrThrow(ctx)
    const key = `stripe:customer:${customerId}:${sessionId}`
    const value = customerData

    const existingSessionRecord = await ctx.db
      .query("kv")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first()

    if (!existingSessionRecord) {
      await ctx.db.insert("kv", { key, value })
      return
    }

    ctx.db.patch(existingSessionRecord._id, { key, value })
  },
})

export const updatePendingCredits = mutation({
  args: { pendingCreditsToAdd: v.number() },
  handler: async (ctx, { pendingCreditsToAdd }) => {
    console.log(
      "[STRIPE] Updating pending credits, adding - ",
      pendingCreditsToAdd,
    )
    const user = await getUserProfileOrThrow(ctx)

    const userCurrents = user.pendingCredits ?? 0
    await ctx.db.patch(user._id, {
      pendingCredits: pendingCreditsToAdd + userCurrents,
    })
  },
})

export const updateUserCreditsAndClearPendings = mutation({
  args: { creditsToAdd: v.number() },
  handler: async (ctx, { creditsToAdd }) => {
    const user = await getUserProfileOrThrow(ctx)

    const userCurrents = user.credits ?? 0
    console.log({ userCurrents })
    const res = creditsToAdd + userCurrents
    console.log({ res })
    console.log({ creditsToAdd })
    await ctx.db.patch(user._id, {
      credits: creditsToAdd + userCurrents,
      pendingCredits: 0,
    })
  },
})
