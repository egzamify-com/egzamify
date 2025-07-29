import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
export const listPracticalExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db.query("basePracticalExams").paginate(paginationOpts);
  },
});
export const getExamDetails = query({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const exam = await ctx.db.get(examId);
    if (!exam) throw new Error("Exam not found");
    const qualification = await ctx.db.get(exam.qualificationId);

    return {
      ...exam,
      qualification,
    };
  },
});
