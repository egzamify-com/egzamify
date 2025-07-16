import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getThreadMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const { chatId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }
    const messagesForThatThread = await ctx.db
      .query("explanations")
      .withIndex("by_chat_id", (q) => q.eq("chatId", chatId))
      .collect();
    console.log("messages for that thread - ", messagesForThatThread);
    return messagesForThatThread;
  },
});

export const getAiResponsesHistory = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }

    const history = await ctx.db
      .query("explanations")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect();

    return history;
  },
});
