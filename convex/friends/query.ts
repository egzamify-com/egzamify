import { getAuthUserId } from "@convex-dev/auth/server";
import { type Infer, v } from "convex/values";
import { APP_CONFIG } from "../../src/APP_CONFIG";
import { type Doc, type Id } from "../_generated/dataModel";
import { query, type QueryCtx } from "../_generated/server";
import { getUserId } from "../custom_helpers";
import {
  getNotFriends,
  getUsersFriends,
  getUsersIncomingRequests,
  getUsersOutcomingRequests,
} from "./helpers";

export type FriendsQueryInfo = {
  ctx: QueryCtx;
  userId: Id<"users">;
  searchedUsers: Doc<"users">[];
  searchRan: boolean;
};

export const friendFilterValidator = v.union(
  v.literal("not_friends"),
  v.literal("accepted_friends"),
  v.literal("incoming_requests"),
  v.literal("outcoming_requests"),
);

export const getFriendsWithSearch = query({
  args: {
    search: v.string(),
    filter: friendFilterValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const { search, filter } = args;

    const searchedUsers = await ctx.db
      .query("users")
      .withSearchIndex("search_username", (q) => q.search("username", search))
      .take(APP_CONFIG.friends.maxSearchResults);

    const queryInfo: FriendsQueryInfo = {
      ctx,
      userId,
      searchedUsers,
      searchRan: search !== "",
    };

    switch (filter) {
      case "accepted_friends":
        return await getUsersFriends(queryInfo);
      case "outcoming_requests":
        return await getUsersOutcomingRequests(queryInfo);
      case "incoming_requests":
        return await getUsersIncomingRequests(queryInfo);
      case "not_friends":
        return await getNotFriends(queryInfo);
    }
  },
});

export const checkUserFriendStatus = query({
  args: { friendId: v.id("users") },
  handler: async (
    ctx,
    args,
  ): Promise<{ status: Infer<typeof friendFilterValidator> }> => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get current user");

    const userSideReq = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", userId).eq("receivingUserId", friendId),
      )
      .first();

    const friendSideReq = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", friendId).eq("receivingUserId", userId),
      )
      .first();

    if (userSideReq && !friendSideReq) {
      if (userSideReq.status === "request_sent")
        return { status: "outcoming_requests" };
      else if (userSideReq.status === "accepted")
        return { status: "accepted_friends" };
    } else if (!userSideReq && friendSideReq) {
      if (friendSideReq.status === "request_sent")
        return { status: "incoming_requests" };
      else if (friendSideReq.status === "accepted")
        return { status: "accepted_friends" };
    } else if (!userSideReq && !friendSideReq) {
      return { status: "not_friends" };
    }
    return { status: "not_friends" };
  },
});
