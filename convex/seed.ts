import { v } from "convex/values"
import { type ReadyQuestionWithAnswers } from "~/app/api/seed-db/seed-teoria/route"
import { mutation } from "./_generated/server"
export const insertDataTeoria = mutation({
  args: { dataProp: v.any() },
  handler: async (ctx, { dataProp }) => {
    const data: ReadyQuestionWithAnswers[] = dataProp

    const promises = data.map(async (question) => {
      const { answers, ...actualQuestion } = question
      const insertedQuestion = await ctx.db.insert("questions", {
        ...actualQuestion,
      })

      const answerPromises = answers.map(async (answer) => {
        await ctx.db.insert("answers", {
          ...answer,
          questionId: insertedQuestion,
        })
        return { ok: true }
      })
      await Promise.all(answerPromises)

      return { ok: true }
    })

    await Promise.all(promises)
    console.log({ ok: true })
  },
})
