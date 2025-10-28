import { v } from "convex/values"
import { query } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"
import { getUserSavedQualifications } from "./helpers"

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
    return await getUserSavedQualifications(ctx)
  },
})
