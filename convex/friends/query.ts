import { getAuthUserId } from "@convex-dev/auth/server"
import { stream } from "convex-helpers/server/stream"
import { paginationOptsValidator } from "convex/server"
import { v, type Infer } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import schema from "../schema"
import {
  getFriendIds,
  getReceivingUserIds,
  getRequestingUserIds,
  getUsersFromFriendIds,
  type friendFilterValidator,
} from "./helpers"

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

    const receivingUserIds = await getReceivingUserIds(ctx, userId)

    const outgoingRequestsFriends = await getUsersFromFriendIds(
      ctx,
      userId,
      receivingUserIds,
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

    const requestingUserIds = await getRequestingUserIds(ctx, userId)

    const incomingRequestsFriends = await getUsersFromFriendIds(
      ctx,
      userId,
      requestingUserIds,
    )

    return incomingRequestsFriends
      .filterWith(async (user) =>
        user.username!.toLowerCase().includes(search.toLowerCase()),
      )
      .paginate(paginationOpts)
  },
})

export const getInvitesDataForSidebar = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)
    const requestingUserIds = await getRequestingUserIds(ctx, userId)
    const receivingUserIds = await getReceivingUserIds(ctx, userId)

    return {
      incomingRequestsCount: requestingUserIds.size,
      outcomingRequestsCount: receivingUserIds.size,
    }
  },
})
