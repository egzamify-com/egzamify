import { v } from "convex/values"
import type Stripe from "stripe"
import { query } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"

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

export const getTransaction = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const user = await getUserProfileOrThrow(ctx)
    const customerId = await ctx.db
      .query("kv")
      .withIndex("by_key", (q) => q.eq("key", `stripe:user:${user._id}`))
      .first()
    if (!customerId) {
      console.error("[STRIPE] Customer id for user not found")
      throw new Error("Customer id for user not found")
    }
    const transactionRecord = await ctx.db
      .query("kv")
      .withIndex("by_key", (q) =>
        q.eq("key", `stripe:customer:${customerId.value}:${sessionId}`),
      )
      .first()
    if (!transactionRecord) {
      console.error("[STRIPE] Transaction not found")
      throw new Error("Transaction not found")
    }
    let payment: Stripe.PaymentIntent | null = null
    try {
      payment = JSON.parse(transactionRecord.value)
    } catch (error) {
      console.error("[STRIPE] Failed to parse transaction from db", error)
      throw new Error("Failed to parse transaction from db")
    }
    if (!payment) {
      console.error("[STRIPE] Failed to parse transaction from db")
      throw new Error("Failed to parse transaction from db")
    }
    // console.log({ payment })
    console.log("[STRIPE] Payment from db status - ", payment.status)
    let status

    if (payment.status === "succeeded") {
      console.log("[STRIPE] Transaction succeeded, time to add credits")
      status = "succeded" as const
    }
    if (payment.status === "canceled") {
      console.error("[STRIPE] Transaction failed")
      status = "canceled" as const
    }
    if (payment.status === "canceled") {
      console.log("[STRIPE] Transaction failed")
      status = "requires_payment_method" as const
    }

    return {
      status,
      creditsPurchased: payment.metadata.creditsPurchased,
    }
  },
})
