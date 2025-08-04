import { v } from "convex/values";
import { type Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { getUserId } from "../auth";

export const storeNewThread = mutation({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    return await ctx.db.insert("explanations", {
      userId: userId,
      content: "",
    });
  },
});

export const storeChatMessages = mutation({
  args: { chatId: v.string(), newContent: v.string() },
  handler: async (ctx, { chatId, newContent }) => {
    const userId = await getUserId(ctx);

    const thread = await ctx.db.get(chatId as Id<"explanations">);
    if (!thread) throw new Error("Thread not found");
    if (thread.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(chatId as Id<"explanations">, {
      content: newContent,
    });
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id("explanations") },
  handler: async (ctx, { chatId }) => {
    const userId = await getUserId(ctx);

    const thread = await ctx.db.get(chatId);

    if (!thread) throw new Error("Thread not found");
    if (thread.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(chatId);
  },
});
