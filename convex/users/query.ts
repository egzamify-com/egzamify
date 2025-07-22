import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");
    return await ctx.db.get(userId);
  },
});
