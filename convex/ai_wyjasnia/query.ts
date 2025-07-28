import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { type Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { parseThreadMessages } from "./helpers";

export const getThreadMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const { chatId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get user");

    const thread = await ctx.db
      .query("explanations")
      .withIndex("by_id", (q) => q.eq("_id", chatId as Id<"explanations">))
      .first();
    // console.log("db record read - ", thread);
    if (!thread) return [];
    if (!thread.content) return [];

    const dbMessages = parseThreadMessages(thread);
    // console.log("parsed messages - ", dbMessages);
    return dbMessages;
  },
});

export const getAiResponsesHistory = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }

    const history = await ctx.db
      .query("explanations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    return history;
  },
});
