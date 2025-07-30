import { getAuthUserId } from "@convex-dev/auth/server";
import { Infer, v } from "convex/values";
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
    const userExam = await ctx.db.get(userExamId);

    userExam?.attachments?.map(async (attachment) => {
      await ctx.storage.delete(attachment.attachmentId!);
      return null;
    });

    await ctx.db.delete(userExamId);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
export const sendAttachment = mutation({
  args: {
    storageId: v.id("_storage"),
    userExamId: v.id("usersPracticalExams"),
    attachmentName: v.string(),
  },
  handler: async (ctx, { storageId, userExamId, attachmentName }) => {
    console.log("Upload happend - ", storageId);
    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    const attachmentType = vv.doc("usersPracticalExams").fields.attachments;

    const newAttachments: Infer<typeof attachmentType> = [
      ...(userExam.attachments ?? []),
      { attachmentName, attachmentId: storageId },
    ];
    await ctx.db.patch(userExamId, { attachments: newAttachments });
  },
});
export const deleteAttachment = mutation({
  args: {
    userExamId: v.id("usersPracticalExams"),
    attachmentId: v.id("_storage"),
  },
  handler: async (ctx, { userExamId, attachmentId }) => {
    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    const attachmentType = vv.doc("usersPracticalExams").fields.attachments;

    const newAttachments: Infer<typeof attachmentType> =
      userExam.attachments?.filter(
        (attachment) => attachment.attachmentId !== attachmentId,
      );
    await ctx.db.patch(userExamId, { attachments: newAttachments });
  },
});
