import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import { vv } from "../schema"

export const saveUserAnswer = mutation({
  args: {
    answer: vv.doc("answers"),
    wasUserCorrect: v.boolean(),
  },
  handler: async (ctx, { answer, wasUserCorrect }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswerId = await ctx.db.insert("userAnswers", {
      userId,
      answerId: answer._id,
      isCorrect: wasUserCorrect,
      questionId: answer.questionId,
    })

    return userAnswerId
  },
})

export const startStudySession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const now = Date.now()
    const sessionId = await ctx.db.insert("userActivityHistory", {
      user_id: userId,
      start_date: now,
      stop_date: now,
    })

    return { success: true, sessionId }
  },
})

export const endStudySession = mutation({
  args: {
    sessionId: v.id("userActivityHistory"),
  },
  handler: async (ctx, args) => {
    await getUserIdOrThrow(ctx)

    await ctx.db.patch(args.sessionId, {
      stop_date: Date.now(),
    })

    return { success: true }
  },
})
