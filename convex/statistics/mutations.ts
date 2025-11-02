import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

export const saveUserAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    answer_index: v.number(),
    isCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx)

    const question = await ctx.db.get(args.questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect()

    const sortedAnswers = answers.sort((a, b) => a.label.localeCompare(b.label))
    const selectedAnswer = sortedAnswers[args.answer_index]

    if (!selectedAnswer) {
      throw new Error("Answer not found")
    }

    await ctx.db.insert("userAnswers", {
      userId,
      questionId: args.questionId,
      answerId: selectedAnswer._id,
      isCorrect: args.isCorrect,
    })

    return { success: true }
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
