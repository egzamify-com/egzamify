import type { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"
import type { FunctionReturnType } from "convex/server"
import { v } from "convex/values"

export type BaseExam = FunctionReturnType<
  typeof api.praktyka.query.getExamDetails
>
export type UserExam = Doc<"usersPracticalExams">

export const requirementsArray = v.array(
  v.object({
    symbol: v.string(),
    description: v.string(),
    answer: v.optional(
      v.object({
        isCorrect: v.boolean(),
        explanation: v.string(),
      }),
    ),
  }),
)

export const requirementsValidator = v.array(
  v.object({
    title: v.string(),
    note: v.optional(v.string()),
    symbol: v.string(),
    requirements: requirementsArray,
  }),
)

export const practicalExamAttachmentValidator = v.array(
  v.object({
    attachmentName: v.string(),
    attachmentId: v.id("_storage"),
  }),
)
export async function getExamDetailsFunc(examCode: string, ctx: QueryCtx) {
  const exam = await ctx.db
    .query("basePracticalExams")
    .withIndex("examCode", (q) => q.eq("code", examCode))
    .first()
  if (!exam) throw new Error("Exam not found")
  const qualification = await ctx.db.get(exam.qualificationId)

  return {
    ...exam,
    qualification,
  }
}
