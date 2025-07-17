import { getAuthUserId } from "@convex-dev/auth/server";
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
