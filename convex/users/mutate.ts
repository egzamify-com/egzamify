import { ConvexError, v } from "convex/values"
import { internalMutation, mutation } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow, vv } from "../custom_helpers"

export const toggleUserActivityStatus = mutation({
  args: { newStatus: v.boolean() },
  handler: async (ctx, { newStatus }) => {
    const userId = await getUserIdOrThrow(ctx)

    // if (newStatus) console.log("User started using app")
    // else console.log("User stopped using app")

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
export const updateUserCredits_WEBHOOK_ONLY = internalMutation({
  args: { creditsToAdd: v.number(), userId: v.id("users") },
  handler: async ({ db }, { creditsToAdd, userId }) => {
    const user = await db.get(userId)
    if (!user) throw new ConvexError("User not found")
    await db.patch(userId, {
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

// do not change username with this, this lacks the unique username check
export const updateUserProfile = mutation({
  args: { newFields: vv.doc("users") },
  handler: async (ctx, { newFields }) => {
    const userId = await getUserIdOrThrow(ctx)

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
