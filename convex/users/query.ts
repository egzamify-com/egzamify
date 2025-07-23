import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");
    console.log("current user fetched");
    return await ctx.db.get(userId);
  },
});
export const getUserFromUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const { username } = args;

    return await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", username))
      .first();
  },
});
