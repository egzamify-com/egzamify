import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { vv } from "../schema";

export const generateUrl = mutation({
  args: {
    attachmentId: v.id("_storage"),
  },
  handler: async (ctx, { attachmentId }) => {
    console.log("LINK - ", await ctx.storage.getUrl(attachmentId));
  },
});

export const startExam = mutation({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    await ctx.db.insert("usersPracticalExams", {
      examId: examId,
      status: "user_pending",
      userId: userId,
    });
  },
});

export const updateUserExamStatus = mutation({
  args: {
    userExamId: v.id("usersPracticalExams"),
    newStatus: vv.doc("usersPracticalExams").fields.status,
  },
  handler: async (ctx, { userExamId, newStatus }) => {
    await ctx.db.patch(userExamId, {
      status: newStatus,
    });
  },
});

export const deleteUserExam = mutation({
  args: { userExamId: v.id("usersPracticalExams") },
  handler: async (ctx, { userExamId }) => {
    await ctx.db.delete(userExamId);
  },
});
