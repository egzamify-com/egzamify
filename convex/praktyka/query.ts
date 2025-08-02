import { asyncMap } from "convex-helpers";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserId } from "../auth";

export const listPracticalExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    await getUserId(ctx);

    const baseExams = await ctx.db
      .query("basePracticalExams")
      .paginate(paginationOpts);

    const withQs = await asyncMap(baseExams.page, async (exam) => {
      const qualification = await ctx.db.get(exam.qualificationId);
      return {
        ...exam,
        qualification,
      };
    });

    return {
      ...baseExams,
      page: withQs,
    };
  },
});

export const getExamDetails = query({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    await getUserId(ctx);

    const exam = await ctx.db.get(examId);
    if (!exam) throw new Error("Exam not found");
    const qualification = await ctx.db.get(exam.qualificationId);

    return {
      ...exam,
      qualification,
    };
  },
});

export const getUserExam = query({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_userId_examId", (q) =>
        q.eq("userId", userId).eq("examId", examId),
      )
      .first();
  },
});
