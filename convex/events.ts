"use node"

import { v } from "convex/values"
import { api } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { PostHogClientConvex } from "./posthog"

export const sendQuizCompletedEvent = internalAction({
  args: {
    userId: v.id("users"),
    oppId: v.id("users"),
    qualificationId: v.id("qualifications"),
    questionCount: v.number(),
  },
  handler: async (ctx, { userId, questionCount, qualificationId, oppId }) => {
    const user = await ctx.runQuery(api.users.query.getUserFromId, {
      userId: userId,
    })
    if (!user) return
    const qualification = await ctx.runQuery(
      api.teoria.query.getQualificationFromId,
      {
        qualificationId: qualificationId,
      },
    )
    try {
      const posthog = PostHogClientConvex()
      posthog.capture({
        event: "PvpQuizCompleted",
        distinctId: user._id,
        properties: {
          opponentId: oppId,
          questionCount,
          qualification: qualification?.name ?? "",
          email: user.email,
          name: user.name,
        },
      })
      await posthog.shutdown()
      console.log("send ph event about quiz completed!")
    } catch (e) {
      console.error(e)
    }
  },
})
