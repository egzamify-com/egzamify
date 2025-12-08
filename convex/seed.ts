import { asyncMap } from "convex-helpers"
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const answer = v.object({
  containsAttachment: v.boolean(),
  content: v.string(),
  isCorrect: v.boolean(),
  label: v.string(),
})

export const insertDataTeoria = mutation({
  args: {
    data: v.array(
      v.object({
        year: v.number(),
        month: v.string(),
        containsAttachment: v.boolean(),
        content: v.string(),
        tags: v.optional(v.array(v.string())),
        answers: v.array(answer),
        qualificationId: v.id("qualifications"),
      }),
    ),
  },
  handler: async (ctx, { data }) => {
    const promises = data.map(async (question) => {
      const insertedQuestion = await ctx.db.insert("questions", {
        containsAttachment: question.containsAttachment,
        content: question.content,
        year: question.year,
        month: question.month,
        qualificationId: question.qualificationId,
        tags: question.tags,
      })

      const answerPromises = question.answers.map(async (answer) => {
        await ctx.db.insert("answers", {
          content: answer.content,
          containsAttachment: answer.containsAttachment,
          isCorrect: answer.isCorrect,
          label: answer.label,
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

export const listQAndAThatNeedImages = query({
  handler: async (ctx, {}) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_contains_image", (q) =>
        q.eq("containsAttachment", true).eq("attachmentId", undefined),
      )
      .collect()

    const qWithQuals = await asyncMap(questions, async (q) => {
      const qual = await ctx.db.get(q.qualificationId)
      if (!qual) return null
      return {
        ...q,
        qualification: qual,
      }
    })

    const filtered = qWithQuals.filter((a) => a != null)

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_contains_image", (q) =>
        q.eq("containsAttachment", true).eq("attachmentId", undefined),
      )
      .collect()

    return {
      questions: filtered,
      answers,
    }
  },
})

export const updateQuestion = mutation({
  args: { questionId: v.id("questions"), attachmentId: v.id("_storage") },
  handler: async (ctx, { questionId, attachmentId }) => {
    return await ctx.db.patch(questionId, { attachmentId })
  },
})

export const disMissQuestion = mutation({
  args: { questionId: v.id("questions") },
  handler: async (ctx, { questionId }) => {
    return await ctx.db.patch(questionId, { containsAttachment: false })
  },
})

export const updateAnswer = mutation({
  args: { answerId: v.id("answers"), attachmentId: v.id("_storage") },
  handler: async (ctx, { answerId, attachmentId }) => {
    return await ctx.db.patch(answerId, { attachmentId })
  },
})

export const disMissAnswer = mutation({
  args: { answerId: v.id("answers") },
  handler: async (ctx, { answerId }) => {
    return await ctx.db.patch(answerId, { containsAttachment: false })
  },
})

export const getQuestionForAnswer = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, { questionId }) => {
    const q = await ctx.db.get(questionId)
    if (!q) return null
    const qual = await ctx.db.get(q?.qualificationId)
    if (!qual) return null
    return {
      question: q,
      qualification: qual,
    }
  },
})
