import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const logInServer = mutation({
  args: { message: v.string() },
  handler: async (ctx, args) => {
    console.log(args.message);
  },
});
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
