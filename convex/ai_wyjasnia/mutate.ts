import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const storeNewThread = mutation({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    console.log("store new thread mut hit");
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }

    const { threadId } = args;
    void (await ctx.db.insert("explanations", {
      chatId: threadId,
      user_id: userId,
      content: "",
    }));
  },
});

export const storeChatMessages = mutation({
  args: { chatId: v.string(), newContent: v.string() },
  handler: async (ctx, args) => {
    console.log("store chat mut hit");
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }
    const { chatId, newContent } = args;
    console.log("looking for chatId - ", chatId);
    const chatArr = await ctx.db
      .query("explanations")
      .withIndex("by_chat_id", (q) => q.eq("chatId", chatId))
      .collect();
    console.log("found chatarr - ", chatArr);
    const chat = chatArr[0];
    void (await ctx.db.patch(chat._id, { content: newContent }));
  },
});
