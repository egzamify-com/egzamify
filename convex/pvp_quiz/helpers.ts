import type { Id } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"
import { v } from "convex/values"

export const pvpQuizPlayerData = v.object({
  answersIds: v.optional(v.array(v.id("userAnswers"))),
  status: v.optional(
    v.union(v.literal("waiting"), v.literal("answering"), v.literal("done")),
  ),
  time: v.optional(v.number()),
  score: v.optional(v.number()),
  submittedAt: v.optional(v.number()),
})

function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array passed in
  const shuffled = [...array]
  let currentIndex = shuffled.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // @ts-expect-error fjkdsl
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ]
  }

  return shuffled
}

export async function getRandomQuestionsIds(
  qualificationId: Id<"qualifications">,
  questionCount: number,
  ctx: QueryCtx,
) {
  const allQuestions = await ctx.db
    .query("questions")
    .withIndex("by_qualification", (q) =>
      q.eq("qualificationId", qualificationId),
    )
    .collect()

  const allQuestionsIds = allQuestions.map((item) => item._id)

  if (allQuestionsIds.length < questionCount) {
    console.warn(
      `Only ${allQuestions.length} questions available, requested ${questionCount}. Returning all.`,
    )
    return allQuestionsIds
  }

  const shuffledIds = shuffleArray(allQuestionsIds)

  const randomQuestionsIds = shuffledIds.slice(0, questionCount)

  return randomQuestionsIds
}
