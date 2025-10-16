import type { Doc } from "convex/_generated/dataModel"
import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import schema from "../schema"
export const startExam = mutation({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    const userId = await getUserIdOrThrow(ctx)

    await ctx.db.insert("usersPracticalExams", {
      examId: examId,
      status: "user_pending",
      userId: userId,
    })
  },
})

export const updateUserExamStatus = mutation({
  args: {
    userExamId: v.id("usersPracticalExams"),
    newStatus: schema.tables.usersPracticalExams.validator.fields.status,
  },
  handler: async (ctx, { userExamId, newStatus }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db.get(userExamId)
    if (!userExam) throw new ConvexError("Nie znaleziono twojego egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    await ctx.db.patch(userExamId, {
      status: newStatus,
    })
  },
})

export const deleteUserExam = mutation({
  args: { userExamId: v.id("usersPracticalExams") },
  handler: async (ctx, { userExamId }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db.get(userExamId)
    if (!userExam) throw new ConvexError("Nie znaleziono twojego egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    userExam.attachments?.map(async (attachment) => {
      await ctx.storage.delete(attachment.attachmentId)
      return null
    })

    await ctx.db.delete(userExamId)
  },
})

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getUserIdOrThrow(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const sendAttachment = mutation({
  args: {
    storageId: v.id("_storage"),
    userExamId: v.id("usersPracticalExams"),
    attachmentName: v.string(),
  },
  handler: async (ctx, { storageId, userExamId, attachmentName }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db.get(userExamId)
    if (!userExam) throw new ConvexError("Nie znaleziono twojego egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    const newAttachments: Doc<"usersPracticalExams">["attachments"] = [
      ...(userExam.attachments ?? []),
      { attachmentName, attachmentId: storageId },
    ]

    await ctx.db.patch(userExamId, { attachments: newAttachments })
  },
})
export const deleteAttachment = mutation({
  args: {
    userExamId: v.id("usersPracticalExams"),
    attachmentId: v.id("_storage"),
  },
  handler: async (ctx, { userExamId, attachmentId }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db.get(userExamId)
    if (!userExam) throw new ConvexError("Nie znaleziono twojego egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    const newAttachments: Doc<"usersPracticalExams">["attachments"] =
      userExam.attachments?.filter(
        (attachment) => attachment.attachmentId !== attachmentId,
      )
    await ctx.db.patch(userExamId, { attachments: newAttachments })
  },
})
export const saveRatingData = mutation({
  args: {
    userExamId: v.id("usersPracticalExams"),
    ratingData: schema.tables.usersPracticalExams.validator.fields.aiRating,
  },
  handler: async (ctx, { userExamId, ratingData }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db.get(userExamId)
    if (!userExam) throw new ConvexError("Nie znaleziono twojego egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    await ctx.db.patch(userExamId, {
      aiRating: ratingData,
    })
  },
})
