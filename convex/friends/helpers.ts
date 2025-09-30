import { stream } from "convex-helpers/server/stream"
import type { Id } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"
import schema from "../schema"
import { type FriendsQueryInfo } from "./query"

export async function getUsersOutcomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const requests = stream(ctx.db, schema)
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
    .filterWith(async (id) => {
      if (id.status === "request_sent") return true
      return false
    })

  const users = requests.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", requestRecord.receivingUserId))
        .filterWith(async (user) => {
          if (!searchRan) return true

          if (searchedUsers.length === 0) return false

          if (
            searchRan &&
            searchedUsers.map((user) => user.username).includes(user.username)
          ) {
            // console.log(`FOUND MATCH for ${user.username}`)
            return true
          }

          return false
        }),
    ["_id"],
  )

  return users.collect()
}
export async function getUsersIncomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const requests = stream(ctx.db, schema)
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
    .filterWith(async (id) => {
      if (id.status === "request_sent") return true
      return false
    })

  const users = requests.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", requestRecord.requestingUserId))
        .filterWith(async (user) => {
          if (!searchRan) return true

          if (searchedUsers.length === 0) return false

          if (
            searchRan &&
            searchedUsers.map((user) => user.username).includes(user.username)
          ) {
            // console.log(`[FRIENDS] found match for ${user.username}`)
            return true
          }

          return false
        }),
    ["_id"],
  )
  return users.collect()
}

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
