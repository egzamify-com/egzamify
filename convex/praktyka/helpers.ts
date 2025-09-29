import type { Id } from "convex/_generated/dataModel";
import type { QueryCtx } from "convex/_generated/server";
import { v } from "convex/values";

export const userExamStatusValidator = v.union(
  v.literal("user_pending"),
  v.literal("ai_pending"),
  v.literal("not_enough_credits_error"),
  v.literal("unknown_error_credits_refunded"),
  v.literal("done"),
);

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
);

export const requirementsValidator = v.array(
  v.object({
    title: v.string(),
    note: v.optional(v.string()),
    symbol: v.string(),
    requirements: requirementsArray,
  }),
);

export const practicalExamAttachmentValidator = v.array(
  v.object({
    attachmentName: v.string(),
    attachmentId: v.id("_storage"),
  }),
);
export async function getExamDetailsFunc(
  examId: Id<"basePracticalExams">,
  ctx: QueryCtx,
) {
  const exam = await ctx.db.get(examId);
  if (!exam) throw new Error("Exam not found");
  const qualification = await ctx.db.get(exam.qualificationId);

  return {
    ...exam,
    qualification,
  };
}
