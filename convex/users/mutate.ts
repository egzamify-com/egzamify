import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserId } from "../custom_helpers";

export const toggleUserActivityStatus = mutation({
  args: { newStatus: v.boolean() },
  handler: async (ctx, args) => {
    const { newStatus } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get current user");

    if (newStatus) console.log("User started using app");
    else console.log("User stopped using app");

    await ctx.db.patch(userId, { isActive: newStatus });
  },
});
export const updateUserCredits = mutation({
  args: { creditsToAdd: v.number() },
  handler: async (ctx, { creditsToAdd }) => {
    const userId = await getUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(userId, { credits: (user.credits ?? 0) + creditsToAdd });
  },
});
