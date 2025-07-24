import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { type Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { parseThreadMessages } from "./helpers";

export const storeNewThread = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("store new thread mut hit");
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }

    return await ctx.db.insert("explanations", {
      user_id: userId,
      content: "",
    });
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

    void (await ctx.db.patch(chatId as Id<"explanations">, {
      content: newContent,
    }));
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id("explanations") },
  handler: async (ctx, args) => {
    console.log("delete chat mut hit");
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get user");
    const { chatId } = args;
    void (await ctx.db.delete(chatId));
  },
});
export const updateAssistantAnnotations = mutation({
  args: { chatId: v.id("explanations"), newAnnotation: v.string() },
  handler: async (ctx, args) => {
    console.log("update chat with annotation");
    const { chatId, newAnnotation } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get user");

    const thread = await ctx.db.get(chatId);
    if (!thread) throw new Error("Chat not found");

    const threadContent = parseThreadMessages(thread);

    const lastMess = threadContent[threadContent.length - 1];

    const strigified = JSON.stringify(newAnnotation);
    const parsed: { id: string; mode: string }[] = JSON.parse(strigified);
    console.log("parsed - ", parsed);

    lastMess.annotations = parsed;
    console.log("current thread content - ", threadContent);
    threadContent.pop();
    threadContent.push(lastMess);
    console.log("newContent", threadContent);
    await ctx.db.patch(chatId, { content: JSON.stringify(threadContent) });
  },
});
