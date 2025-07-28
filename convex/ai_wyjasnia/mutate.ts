import { getAuthUserId } from "@convex-dev/auth/server";
import { Message } from "ai";
import { v } from "convex/values";
import { type Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export const storeNewThread = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("store new thread mut hit");
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Failed to get user");
    }

    return await ctx.db.insert("explanations", {
      userId: userId,
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
    // 1. Parse the stringified content of the thread into an array of messages
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

    // Check if there are any messages in the thread
    if (threadContent.length === 0) {
      console.warn("No messages in thread to add annotation to:", chatId);
      // Depending on your logic, you might want to throw an error or just return
      return;
    }

    // 2. Get the last message in the array
    const lastMessage = threadContent[threadContent.length - 1];

    // 3. Parse the newAnnotation string into an array of annotation objects
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

    // 4. Append the new annotations to the last message's annotations array
    // Initialize annotations if they don't exist
    // if (!lastMessage.annotations) {
    //   lastMessage.annotations = [];
    // }
    lastMessage.annotations ??= [];
    // Append the new parsed annotations
    lastMessage.annotations.push(...parsedAnnotations);

    console.log("Updated last message:", lastMessage);

    // 5. Stringify the entire updated thread content array back to a string
    const newContentString = JSON.stringify(threadContent);

    // 6. Patch the Convex document with the new stringified content
    await ctx.db.patch(chatId, { content: newContentString });
    console.log("Chat updated successfully with new annotation.");
  },
});
