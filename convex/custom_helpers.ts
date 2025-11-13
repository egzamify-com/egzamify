import { getAuthUserId } from "@convex-dev/auth/server"
import { makeUseQueryWithStatus } from "convex-helpers/react"
import { useQueries } from "convex-helpers/react/cache"
import { ConvexError } from "convex/values"
import type { Id } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"

export const useQuery = makeUseQueryWithStatus(useQueries)

export async function getUserIdOrThrow(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx)
  if (!userId) {
    throw new ConvexError("Nie jesteś zalogowany")
  }
  return userId
}

export async function getUserProfileOrThrow(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx)
  if (!userId) {
    throw new ConvexError("Nie jesteś zalogowany")
  }
  const res = await ctx.db.get(userId)
  if (!res) {
    throw new ConvexError("Nie znaleziono użytkownika")
  }
  return res
}
