import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveExplanation = mutation({
  args: {
    questionId: v.id("questions"),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const { questionId, explanation } = args;

    try {
      await ctx.db.patch(questionId, {
        explanation,
      });

      return { success: true };
    } catch (error) {
      console.error("Błąd podczas zapisywania wyjaśnienia:", error);
      return { success: false };
    }
  },
});
