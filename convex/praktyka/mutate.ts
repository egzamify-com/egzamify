import { type Infer, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserId } from "../auth";
import { vv } from "../schema";

export const startExam = mutation({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const userId = await getUserId(ctx);

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
    const userId = await getUserId(ctx);

    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    if (userExam.userId !== userId) throw new Error("User not authorized");

    await ctx.db.patch(userExamId, {
      status: newStatus,
    });
  },
});

export const deleteUserExam = mutation({
  args: { userExamId: v.id("usersPracticalExams") },
  handler: async (ctx, { userExamId }) => {
    const userId = await getUserId(ctx);

    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    if (userExam.userId !== userId) throw new Error("User not authorized");

    userExam.attachments?.map(async (attachment) => {
      await ctx.storage.delete(attachment.attachmentId);
      return null;
    });

    await ctx.db.delete(userExamId);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getUserId(ctx);
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
    const userId = await getUserId(ctx);

    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    if (userExam.userId !== userId) throw new Error("User not authorized");

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
    const userId = await getUserId(ctx);

    const userExam = await ctx.db.get(userExamId);
    if (!userExam) throw new Error("User exam not found");
    if (userExam.userId !== userId) throw new Error("User not authorized");

    const attachmentType = vv.doc("usersPracticalExams").fields.attachments;

    const newAttachments: Infer<typeof attachmentType> =
      userExam.attachments?.filter(
        (attachment) => attachment.attachmentId !== attachmentId,
      );
    await ctx.db.patch(userExamId, { attachments: newAttachments });
  },
});
