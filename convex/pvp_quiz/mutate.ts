import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"
import { getRandomQuestionsIds } from "./helpers"

export const createPvpQuiz = mutation({
  args: {
    opponentUserId: v.id("users"),
    quizQualificationId: v.id("qualifications"),
    questionCount: v.number(),
  },
  handler: async (
    ctx,
    { opponentUserId, quizQualificationId, questionCount },
  ) => {
    const user = await getUserProfileOrThrow(ctx)

    const randomQuizQuestionsIds = await getRandomQuestionsIds(
      quizQualificationId,
      questionCount,
      ctx,
    )

    const battleId = await ctx.db.insert("pvpQuizzes", {
      status: "waiting_for_oponent_accept",
      opponentUserId,
      creatorUserId: user._id,
      quizQualificationId,
      quizQuestionsIds: randomQuizQuestionsIds,
    })

    return battleId.toString()
  },
})
