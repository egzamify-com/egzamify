import { stream } from "convex-helpers/server/stream"
import type { Id } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"
import { v } from "convex/values"
import schema from "../schema"

export const friendFilterValidator = v.union(
  v.literal("not_friends"),
  v.literal("accepted_friends"),
  v.literal("incoming_requests"),
  v.literal("outcoming_requests"),
)

export async function getFriendIds(ctx: QueryCtx, userId: Id<"users">) {
  const friendsFromRequests = await ctx.db
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
    .filter((q) => q.eq(q.field("status"), "accepted"))
    .collect()

  const friendsFromIncoming = await ctx.db
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
    .filter((q) => q.eq(q.field("status"), "accepted"))
    .collect()

  const friendIds = new Set()

  friendsFromRequests.forEach((friend) => {
    friendIds.add(friend.receivingUserId)
  })

  friendsFromIncoming.forEach((friend) => {
    friendIds.add(friend.requestingUserId)
  })
  return friendIds
}

export async function getRequestingUserIds(ctx: QueryCtx, userId: Id<"users">) {
  const requests = await ctx.db
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
    .filter((q) => q.eq(q.field("status"), "request_sent"))
    .collect()

  return new Set(requests.map((r) => r.requestingUserId))
}
export async function getReceivingUserIds(ctx: QueryCtx, userId: Id<"users">) {
  const requests = await ctx.db
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
    .filter((q) => q.eq(q.field("status"), "request_sent"))
    .collect()

  return new Set(requests.map((r) => r.receivingUserId))
}
export async function getUsersFromFriendIds(
  ctx: QueryCtx,
  userId: Id<"users">,
  ids: Set<Id<"users">>,
) {
  return stream(ctx.db, schema)
    .query("users")
    .filterWith(async (user) => ids.has(user._id) && user._id !== userId)
}
