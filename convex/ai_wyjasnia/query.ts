import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { type Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { getUserId } from "../auth";
import { parseThreadMessages } from "./helpers";

export const getThreadMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const userId = await getUserId(ctx);

    const thread = await ctx.db
      .query("explanations")
      .withIndex("by_id", (q) => q.eq("_id", chatId as Id<"explanations">))
      .first();

    if (!thread) return [];
    if (!thread.content) return [];
    if (thread.userId !== userId) throw new Error("Unauthorized");

    return parseThreadMessages(thread);
  },
});

export const getAiResponsesHistory = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getUserId(ctx);

    const history = await ctx.db
      .query("explanations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);

    return history;
  },
});
