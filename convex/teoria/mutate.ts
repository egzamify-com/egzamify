import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { mutation } from "../_generated/server"

export const chargeCreditsOrThrow = mutation({
  args: {
    creditsToCharge: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("User not authenticated")

    const user = await ctx.db.get(userId)
    if (!user) throw new Error("User not found")

    const currentCredits = user.credits ?? 0

    if (currentCredits < args.creditsToCharge) {
      return {
        message: "user DOESNT have enough credits",
        success: false,
      }
    }

    await ctx.db.patch(userId, {
      credits: currentCredits - args.creditsToCharge,
    })

    return {
      message: "user has enough credits",
      success: true,
    }
  },
})

export const updateUserCredits = mutation({
  args: {
    creditsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("User not authenticated")

    const user = await ctx.db.get(userId)
    if (!user) throw new Error("User not found")

    const currentCredits = user.credits ?? 0

    await ctx.db.patch(userId, {
      credits: currentCredits + args.creditsToAdd,
    })

    return { success: true }
  },
})
