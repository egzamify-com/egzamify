import { asyncMap } from "convex-helpers"
import type { QueryCtx } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"

export async function getUserSavedQualifications(ctx: QueryCtx) {
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
}
