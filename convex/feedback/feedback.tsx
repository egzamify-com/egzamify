import { v, type Infer } from "convex/values"
import { internal } from "../_generated/api"
import { action, internalMutation, internalQuery } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import schema from "../schema"

export type FeedbackType = Infer<
  typeof schema.tables.feedbackTable.validator.fields.type
>

const hourInMilisecs = 3600000

export const sendFeedback = action({
  args: {
    content: v.string(),
    type: schema.tables.feedbackTable.validator.fields.type,
  },
  handler: async (ctx, { content, type }) => {
    const feedbacks = await ctx.runQuery(
      internal.feedback.feedback.getUserFeedbacks,
    )
    console.log({ feedbacks })

    const currentTime = new Date().getTime()
    const lastHour = currentTime - hourInMilisecs

    const lastHourCount = feedbacks.filter(
      (feedback) => feedback._creationTime > lastHour,
    ).length

    if (lastHourCount >= 5) {
      throw new Error(
        "Too many feedbacks sent in last hour, please try again later",
      )
    }

    await ctx.runMutation(internal.feedback.feedback.createFeedback, {
      content,
      type,
    })
  },
})

export const getUserFeedbacks = internalQuery({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const usersFeedbackRecords = await ctx.db
      .query("feedbackTable")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()

    return usersFeedbackRecords
  },
})

export const createFeedback = internalMutation({
  args: {
    content: v.string(),
    type: schema.tables.feedbackTable.validator.fields.type,
  },
  handler: async (ctx, { content, type }) => {
    const userId = await getUserIdOrThrow(ctx)

    await ctx.db.insert("feedbackTable", {
      userId,
      content,
      type,
    })
  },
})
