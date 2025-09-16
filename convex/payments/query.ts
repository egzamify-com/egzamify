import { v } from "convex/values";
import { query } from "../_generated/server";

export const getStripeCustomerId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const key = `stripe:user:${userId}`;
    const result = await ctx.db
      .query("kv")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    return result?.value;
  },
});
