import { asyncMap } from "convex-helpers"
import { v } from "convex/values"
import { query } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"

export const getCurrentUser = query({
  handler: async (ctx) => {
    return await getUserProfileOrThrow(ctx)
  },
})
export const getUserFromUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", username))
      .first()
  },
})

export const getSavedQualifications = query({
  handler: async (ctx) => {
    const user = await getUserProfileOrThrow(ctx)
    const allQualifications = await ctx.db.query("qualifications").collect()

    if (!user.savedQualificationsIds) {
      return { userSavedQualifications: [], allQualifications }
    }

    const userSavedQualifications = await asyncMap(
      user.savedQualificationsIds,
      async (prefferedQualificationId) => {
        const qual = await ctx.db.get(prefferedQualificationId)
        if (!qual) {
          return null
        }
        return qual
      },
    )

    if (!userSavedQualifications) {
      return { userSavedQualifications: [], allQualifications }
    }

    return {
      userSavedQualifications: userSavedQualifications.filter(
        (qual) => qual !== null,
      ),
      allQualifications,
    }
  },
})
