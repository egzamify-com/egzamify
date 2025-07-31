import { Message } from "ai";
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

export const updateAssistantAnnotations = mutation({
  args: { chatId: v.id("explanations"), newAnnotation: v.string() },
  handler: async (ctx, { chatId, newAnnotation }) => {
    const userId = await getUserId(ctx);

    const thread = await ctx.db.get(chatId);
    if (!thread) throw new Error("Chat not found");
    if (thread.userId !== userId) throw new Error("Unauthorized");

    let threadContent: Message[];
    try {
      threadContent = JSON.parse(thread.content);
      if (!Array.isArray(threadContent)) {
        throw new Error("Parsed content is not an array.");
      }
    } catch (parseError) {
      console.error(
        "Error parsing thread content for chatId:",
        chatId,
        parseError,
      );
      throw new Error("Invalid thread content format.");
    }

    if (threadContent.length === 0) {
      console.warn("No messages in thread to add annotation to:", chatId);
      return;
    }

    const lastMessage = threadContent[threadContent.length - 1];

    let parsedAnnotations: { id: string; mode: string }[];
    try {
      parsedAnnotations = JSON.parse(newAnnotation);
      if (!Array.isArray(parsedAnnotations)) {
        throw new Error("newAnnotation is not a valid JSON array.");
      }
    } catch (parseError) {
      console.error("Error parsing newAnnotation string:", parseError);
      throw new Error("Invalid newAnnotation format.");
    }

    lastMessage.annotations ??= [];
    lastMessage.annotations.push(...parsedAnnotations);

    console.log("Updated last message:", lastMessage);

    const newContentString = JSON.stringify(threadContent);

    await ctx.db.patch(chatId, { content: newContentString });
  },
});
