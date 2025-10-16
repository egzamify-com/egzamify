import type { QueryCtx } from "convex/_generated/server"
import { ConvexError } from "convex/values"

export async function getQualificationIdFromNameOrThrow(
  ctx: QueryCtx,
  qualificationName: string,
) {
  const qualification = await ctx.db
    .query("qualifications")
    .withIndex("by_name", (q) => q.eq("name", qualificationName))
    .first()
  if (!qualification?._id) {
    throw new ConvexError(`Nie znaleziono kwalifikacji: ${qualificationName}`)
  }

  return qualification?._id
}
