import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserProfileOrThrow } from "../custom_helpers";

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
    const user = await getUserProfileOrThrow(ctx);

    await ctx.db.patch(user._id, {
      credits: (user.credits ?? 0) + creditsToAdd,
    });
  },
});
export const chargeCreditsOrThrow = mutation({
  args: { creditsToCharge: v.number() },
  handler: async (ctx, { creditsToCharge }) => {
    const user = await getUserProfileOrThrow(ctx);

    if ((user.credits ?? 0) >= creditsToCharge) {
      console.log("user has enough to charge");
      await ctx.db.patch(user._id, {
        credits: (user.credits ?? 0) - creditsToCharge,
      });
      return { ok: true, message: "user has enough credits" } as const;
    }
    if ((user.credits ?? 0) < creditsToCharge) {
      return { ok: false, message: "user DOESNT have enough credits" } as const;
    }
    return { ok: false, message: "no if hit?" } as const;
  },
});
