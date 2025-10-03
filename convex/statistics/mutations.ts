import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveUserAnswer = mutation({
  args: {
    question_id: v.id("questions"),
    answer_index: v.number(),
    isCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const question = await ctx.db.get(args.question_id);
    if (!question) {
      throw new Error("Question not found");
    }

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("question_id", args.question_id))
      .collect();

    const sortedAnswers = answers.sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const selectedAnswer = sortedAnswers[args.answer_index];

    if (!selectedAnswer) {
      throw new Error("Answer not found");
    }

    await ctx.db.insert("userAnswers", {
      user_id: userId,
      question_id: args.question_id,
      answer_id: selectedAnswer._id,
      isCorrect: args.isCorrect,
      answered_at: Date.now(),
    });

    return { success: true };
  },
});

export const startStudySession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const now = Date.now();
    const sessionId = await ctx.db.insert("userActivityHistory", {
      user_id: userId,
      start_date: now,
      stop_date: now,
    });

    return { success: true, sessionId };
  },
});

export const endStudySession = mutation({
  args: {
    sessionId: v.id("userActivityHistory"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    await ctx.db.patch(args.sessionId, {
      stop_date: Date.now(),
    });

    return { success: true };
  },
});
