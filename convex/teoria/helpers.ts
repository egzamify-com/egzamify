import type { QueryCtx } from "convex/_generated/server"

export async function getQualificationIdFromNameOrThrow(
  ctx: QueryCtx,
  qualificationName: string,
) {
  const qualification = await ctx.db
    .query("qualifications")
    .withIndex("by_name", (q) => q.eq("name", qualificationName))
    .first()
  if (!qualification?._id) {
    throw new Error(`Qualification not found: ${qualificationName}`)
  }

  return qualification?._id
}
