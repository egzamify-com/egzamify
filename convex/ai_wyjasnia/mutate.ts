import { ConvexError, v } from "convex/values"
import { type Id } from "../_generated/dataModel"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"

export const storeNewThread = mutation({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    return await ctx.db.insert("explanations", {
      userId: userId,
      content: "",
    })
  },
})

export const storeChatMessages = mutation({
  args: { chatId: v.string(), newContent: v.string() },
  handler: async (ctx, { chatId, newContent }) => {
    const userId = await getUserIdOrThrow(ctx)

    const thread = await ctx.db.get(chatId as Id<"explanations">)
    if (!thread) throw new ConvexError("Czat nie znaleziony")
    if (thread.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego czatu")

    await ctx.db.patch(chatId as Id<"explanations">, {
      content: newContent,
    })
  },
})

export const deleteChat = mutation({
  args: { chatId: v.id("explanations") },
  handler: async (ctx, { chatId }) => {
    const userId = await getUserIdOrThrow(ctx)

    const thread = await ctx.db.get(chatId)

    if (!thread) throw new ConvexError("Czat nie znaleziony")
    if (thread.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego czatu")

    await ctx.db.delete(chatId)
  },
})
