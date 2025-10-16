import { v, type Infer } from "convex/values"
import { APP_CONFIG } from "../../src/APP_CONFIG"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import schema from "../schema"

export type FeedbackType = Infer<
  typeof schema.tables.feedbackTable.validator.fields.type
>

const hourInMilisecs = 3600000

export const sendFeedback = mutation({
  args: {
    content: v.string(),
    type: schema.tables.feedbackTable.validator.fields.type,
  },

  handler: async (ctx, { content, type }) => {
    const userId = await getUserIdOrThrow(ctx)

    const usersFeedbackRecords = await ctx.db
      .query("feedbackTable")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()

    const currentTime = new Date().getTime()
    const lastHour = currentTime - hourInMilisecs

    const lastHourCount = usersFeedbackRecords.filter(
      (feedback) => feedback._creationTime > lastHour,
    ).length

    if (lastHourCount >= APP_CONFIG.feedback.maxFeedbacksSentPerHour) {
      throw new Error(
        "Za dużo opinii wysłanych w ciągu ostatniej godziny, spróbuj ponownie później",
      )
    }

    await ctx.db.insert("feedbackTable", {
      userId,
      content,
      type,
    })
  },
})
