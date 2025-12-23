import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

export const saveExplanation = mutation({
  args: {
    questionId: v.id("questions"),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx)

    const { questionId, explanation } = args

    try {
      await ctx.db.patch(questionId, {
        explanation,
      })

      return { success: true }
    } catch (error) {
      console.error("Błąd podczas zapisywania wyjaśnienia:", error)
      return { success: false }
    }
  },
})

export const importQuestionsWithAnswers = mutation({
  args: {
    data: v.array(
      v.object({
        content: v.string(),
        month: v.string(),
        year: v.number(),
        qualificationId: v.string(),
        answers: v.array(
          v.object({
            content: v.string(),
            isCorrect: v.boolean(),
            label: v.string(),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // const userId = await getUserIdOrThrow(ctx); // Odkomentuj jeśli import wymaga admina

    const results = []

    for (const item of args.data) {
      const newQuestionId = await ctx.db.insert("questions", {
        content: item.content,
        month: item.month,
        year: item.year,
        qualificationId: item.qualificationId as any,
      })

      for (const answer of item.answers) {
        await ctx.db.insert("answers", {
          content: answer.content,
          isCorrect: answer.isCorrect,
          label: answer.label,
          questionId: newQuestionId,
        })
      }

      results.push(newQuestionId)
    }

    return { success: true, count: results.length }
  },
})

export const hello = mutation({
  args: {},
  handler: async (ctx) => {
    return "Działa!"
  },
})
