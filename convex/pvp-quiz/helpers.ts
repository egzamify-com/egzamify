import { v } from "convex/values"

export const pvpQuizPlayerData = v.object({
  answersIds: v.array(v.id("userAnswers")),
  status: v.union(
    v.literal("waiting"),
    v.literal("answering"),
    v.literal("done"),
  ),
  time: v.number(),
  score: v.number(),
})
