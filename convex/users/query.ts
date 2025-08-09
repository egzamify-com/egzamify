import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserId } from "../custom_helpers";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    // console.log("current user fetched");
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
