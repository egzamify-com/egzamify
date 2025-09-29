import { asyncMap } from "convex-helpers";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserIdOrThrow } from "../custom_helpers";
import { getExamDetailsFunc } from "./helpers";

export const listPracticalExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    await getUserIdOrThrow(ctx);

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
    await getUserIdOrThrow(ctx);

    return getExamDetailsFunc(examId, ctx);
  },
});

export const getUserExamFromExamId = query({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const userId = await getUserIdOrThrow(ctx);

    const userExam = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_userId_examId", (q) =>
        q.eq("userId", userId).eq("examId", examId),
      )
      .filter((q) => q.eq(q.field("status"), "user_pending"))
      .first();

    const baseExam = await getExamDetailsFunc(examId, ctx);
    if (!baseExam) throw new Error("Base exam not found");

    return {
      userExam,
      baseExam,
    };
  },
});

export const getUserExamDetails = query({
  args: { userExamId: v.id("usersPracticalExams") },
  handler: async (ctx, { userExamId }) => {
    const userId = await getUserIdOrThrow(ctx);

    const userExam = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_id", (q) => q.eq("_id", userExamId))
      .first();

    if (!userExam) throw new Error("User exam not found");
    if (userExam.userId !== userId) throw new Error("Unauthorized");

    const baseExam = await ctx.db.get(userExam.examId);
    if (!baseExam) throw new Error("Base exam not found");

    const qualification = await ctx.db.get(baseExam.qualificationId);
    if (!qualification) throw new Error("Qualification not found");

    return {
      ...userExam,
      baseExam: {
        ...baseExam,
        qualification,
      },
    };
  },
});
export const listUserExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getUserIdOrThrow(ctx);
    const userExams = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "done"))
      .order("desc")
      .paginate(paginationOpts);

    const withQ = await asyncMap(userExams.page, async (userExam) => {
      const baseExam = await ctx.db.get(userExam.examId);
      if (!baseExam) throw new Error("Exam not found");
      const qualification = await ctx.db.get(baseExam.qualificationId);

      return {
        ...userExam,
        baseExam: {
          ...baseExam,
          qualification,
        },
      };
    });
    return {
      ...userExams,
      page: withQ,
    };
  },
});
