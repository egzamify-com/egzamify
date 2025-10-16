import { paginationOptsValidator } from "convex/server"
import { ConvexError, v } from "convex/values"
import { type Id } from "../_generated/dataModel"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import { parseThreadMessages } from "./helpers"

export const getThreadMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const userId = await getUserIdOrThrow(ctx)

    const thread = await ctx.db
      .query("explanations")
      .withIndex("by_id", (q) => q.eq("_id", chatId as Id<"explanations">))
      .first()

    if (!thread) return null
    if (!thread.content) return null
    if (thread.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego czatu")

    return {
      messages: parseThreadMessages(thread),
      ...thread,
    }
  },
})

export const getAiResponsesHistory = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getUserIdOrThrow(ctx)

    const history = await ctx.db
      .query("explanations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts)

    return history
  },
})
