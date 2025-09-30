import { getAuthUserId } from "@convex-dev/auth/server"
import { stream } from "convex-helpers/server/stream"
import { paginationOptsValidator } from "convex/server"
import { type Infer, v } from "convex/values"
import { APP_CONFIG } from "../../src/APP_CONFIG"
import { type Doc, type Id } from "../_generated/dataModel"
import { query, type QueryCtx } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import schema from "../schema"
import {
  getFriendIds,
  getUsersIncomingRequests,
  getUsersOutcomingRequests,
} from "./helpers"

export type FriendsQueryInfo = {
  ctx: QueryCtx
  userId: Id<"users">
  searchedUsers: Doc<"users">[]
  searchRan: boolean
}

export const friendFilterValidator = v.union(
  v.literal("not_friends"),
  v.literal("accepted_friends"),
  v.literal("incoming_requests"),
  v.literal("outcoming_requests"),
)

export const getFriendsWithSearch = query({
  args: {
    search: v.string(),
    filter: friendFilterValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx)

    const { search, filter } = args

    const searchedUsers = await ctx.db
      .query("users")
      .withSearchIndex("search_username", (q) => q.search("username", search))
      .take(APP_CONFIG.friends.maxSearchResults)

    const queryInfo: FriendsQueryInfo = {
      ctx,
      userId,
      searchedUsers,
      searchRan: search !== "",
    }

    switch (filter) {
      case "outcoming_requests":
        return await getUsersOutcomingRequests(queryInfo)
      case "incoming_requests":
        return await getUsersIncomingRequests(queryInfo)
    }
  },
})
export const checkUserFriendStatus = query({
  args: { friendId: v.id("users") },
  handler: async (
    ctx,
    args,
  ): Promise<{ status: Infer<typeof friendFilterValidator> }> => {
    const { friendId } = args
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Failed to get current user")

    const userSideReq = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", userId).eq("receivingUserId", friendId),
      )
      .first()

    const friendSideReq = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", friendId).eq("receivingUserId", userId),
      )
      .first()

    if (userSideReq && !friendSideReq) {
      if (userSideReq.status === "request_sent")
        return { status: "outcoming_requests" }
      else if (userSideReq.status === "accepted")
        return { status: "accepted_friends" }
    } else if (!userSideReq && friendSideReq) {
      if (friendSideReq.status === "request_sent")
        return { status: "incoming_requests" }
      else if (friendSideReq.status === "accepted")
        return { status: "accepted_friends" }
    } else if (!userSideReq && !friendSideReq) {
      return { status: "not_friends" }
    }
    return { status: "not_friends" }
  },
})

export const getPaginatedNotFriends = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.string(),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const userId = await getUserIdOrThrow(ctx)

    const friendIds = await getFriendIds(ctx, userId)

    const nonFriends = stream(ctx.db, schema)
      .query("users")
      .filterWith(
        async (user) => !friendIds.has(user._id) && user._id !== userId,
      )

    const filteredNonFriends = nonFriends.filterWith(async (user) =>
      user.username!.toLowerCase().includes(search.toLowerCase()),
    )
    return filteredNonFriends.paginate(paginationOpts)
  },
})

export const getPaginatedFriends = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.string(),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const userId = await getUserIdOrThrow(ctx)
    const friendIds = await getFriendIds(ctx, userId)
    const friends = stream(ctx.db, schema)
      .query("users")
      .filterWith(
        async (user) => friendIds.has(user._id) && user._id !== userId,
      )
    return friends
      .filterWith(async (user) =>
        user.username!.toLowerCase().includes(search.toLowerCase()),
      )
      .paginate(paginationOpts)
  },
})

export const getPaginatedOutgoingRequests = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.string(),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const userId = await getUserIdOrThrow(ctx)

    const requests = await ctx.db
      .query("friends")
      .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
      .filter((q) => q.eq(q.field("status"), "request_sent"))
      .collect()

    const receivingUserIds = new Set(requests.map((r) => r.receivingUserId))

    const outgoingRequestsFriends = stream(ctx.db, schema)
      .query("users")
      .filterWith(
        async (user) => receivingUserIds.has(user._id) && user._id !== userId,
      )

    return outgoingRequestsFriends
      .filterWith(async (user) =>
        user.username!.toLowerCase().includes(search.toLowerCase()),
      )
      .paginate(paginationOpts)
  },
})
export const getPaginatedIncomingRequests = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.string(),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const userId = await getUserIdOrThrow(ctx)

    const requests = await ctx.db
      .query("friends")
      .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
      .filter((q) => q.eq(q.field("status"), "request_sent"))
      .collect()

    const requestingUserIds = new Set(requests.map((r) => r.requestingUserId))

    const incomingRequestsFriends = stream(ctx.db, schema)
      .query("users")
      .filterWith(
        async (user) => requestingUserIds.has(user._id) && user._id !== userId,
      )

    return incomingRequestsFriends
      .filterWith(async (user) =>
        user.username!.toLowerCase().includes(search.toLowerCase()),
      )
      .paginate(paginationOpts)
  },
})
