import { v } from "convex/values"

export const pvpQuizPlayerData = v.object({
  answersIds: v.optional(v.array(v.id("userAnswers"))),
  status: v.optional(
    v.union(v.literal("waiting"), v.literal("answering"), v.literal("done")),
  ),
  time: v.optional(v.number()),
  score: v.optional(v.number()),
})
