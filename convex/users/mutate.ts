import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow, vv } from "../custom_helpers"

export const toggleUserActivityStatus = mutation({
  args: { newStatus: v.boolean() },
  handler: async (ctx, args) => {
    const { newStatus } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Failed to get current user")

    if (newStatus) console.log("User started using app")
    else console.log("User stopped using app")

    await ctx.db.patch(userId, { isActive: newStatus })
  },
})
export const updateUserCredits = mutation({
  args: { creditsToAdd: v.number() },
  handler: async (ctx, { creditsToAdd }) => {
    const user = await getUserProfileOrThrow(ctx)

    await ctx.db.patch(user._id, {
      credits: (user.credits ?? 0) + creditsToAdd,
    })
  },
})
export const chargeCreditsOrThrow = mutation({
  args: { creditsToCharge: v.number() },
  handler: async (ctx, { creditsToCharge }) => {
    const user = await getUserProfileOrThrow(ctx)

    if ((user.credits ?? 0) >= creditsToCharge) {
      console.log("user has enough to charge")
      await ctx.db.patch(user._id, {
        credits: (user.credits ?? 0) - creditsToCharge,
      })
      return { ok: true, message: "user has enough credits" } as const
    }
    if ((user.credits ?? 0) < creditsToCharge) {
      return { ok: false, message: "user DOESNT have enough credits" } as const
    }
    return { ok: false, message: "no if hit?" } as const
  },
})
export const updateUserProfile = mutation({
  args: { newFields: vv.doc("users") },
  handler: async (ctx, { newFields }) => {
    const userId = await getUserIdOrThrow(ctx)

    if (newFields.username) {
      throw new ConvexError("Use appropriate query to update unique username")
    }

    await ctx.db.patch(userId, { ...newFields })
  },
})
export const updateUsername = mutation({
  args: { newUsername: v.string() },
  handler: async (ctx, { newUsername }) => {
    const userId = await getUserIdOrThrow(ctx)

    const usersWithThatUsername = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", newUsername))
      .collect()

    if (usersWithThatUsername.length > 0) {
      console.error("[USERS] Username ", newUsername, " is taken")
      throw new ConvexError("Nazwa użytkownika jest zajęta")
    }

    return await ctx.db.patch(userId, { username: newUsername })
  },
})
