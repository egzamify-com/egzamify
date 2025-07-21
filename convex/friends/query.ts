import { getAuthUserId } from "@convex-dev/auth/server";
import { stream } from "convex-helpers/server/stream";
import { v } from "convex/values";
import { APP_CONFIG } from "../../src/APP_CONFIG";
import { Doc, Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import schema from "../schema";

type FriendsQueryInfo = {
  ctx: QueryCtx;
  userId: Id<"users">;
  searchedUsers: Doc<"users">[];
  searchRan: boolean;
};

export const friendFilterValidator = v.union(
  // v.literal("not_friends"),
  v.literal("accepted_friends"),
  // v.literal("incoming_requests"),
  v.literal("outcoming_requests"),
);

export const getFriendsWithSearch = query({
  args: {
    search: v.string(),
    filter: friendFilterValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get user");

    const { search, filter } = args;
    console.log("filter - ", filter);
    console.log("search - ", search);
    console.log("searchRan - ", search != "");

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
    }
  },
});

async function getUsersFriends({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const acceptedFriendRecords = stream(ctx.db, schema)
    .query("acceptedFriends")
    .withIndex("user_id", (q) => q.eq("user_id", userId));

  console.log("searched users - ", searchedUsers);

  const users = acceptedFriendRecords.flatMap(
    async (friendRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", friendRecord.friend_id))
        .filterWith(async (user) => {
          if (!searchRan) return true;

          if (searchedUsers.length === 0) return false;

          if (
            searchRan &&
            searchedUsers.map((user) => user.username).includes(user.username)
          ) {
            console.log(`FOUND MATCH for ${user.username}`);
            return true;
          }

          return false;
        }),
    ["_id"],
  );

  return users.collect();
}

async function getUsersOutcomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friendRequests")
    .withIndex("requesting_user_id", (q) => q.eq("requesting_user_id", userId));

  const users = ids.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", requestRecord.receiving_user_id))
        .filterWith(async (user) => {
          if (!searchRan) return true;

          if (searchedUsers.length === 0) return false;

          if (
            searchRan &&
            searchedUsers.map((user) => user.username).includes(user.username)
          ) {
            console.log(`FOUND MATCH for ${user.username}`);
            return true;
          }

          return false;
        }),
    ["_id"],
  );

  return users.collect();
}
