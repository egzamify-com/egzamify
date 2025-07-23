import { getAuthUserId } from "@convex-dev/auth/server";
import { stream } from "convex-helpers/server/stream";
import { Infer, v } from "convex/values";
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
      case "incoming_requests":
        return await getUsersIncomingRequests(queryInfo);
      case "not_friends":
        return await getNotFriends(queryInfo);
    }
  },
});

async function getUsersFriends({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const fromRequestsRecords = await ctx.db
    .query("friends")
    .withIndex("requesting_user_id", (q) => q.eq("requesting_user_id", userId))
    .collect();

  const fromOthersRecords = await ctx.db
    .query("friends")
    .withIndex("receiving_user_id", (q) => q.eq("receiving_user_id", userId))
    .collect();

  const usersFromReq = fromRequestsRecords
    .filter((friendRecord) => {
      if (friendRecord.status === "accepted") return true;
    })
    .map((friendRecord) => {
      const user = ctx.db.get(friendRecord.receiving_user_id);
      return user;
    });

  const usersFromOthers = fromOthersRecords
    .filter((friendRecord) => {
      if (friendRecord.status === "accepted") return true;
    })
    .map((friendRecord) => {
      const user = ctx.db.get(friendRecord.requesting_user_id);
      return user;
    });

  const usersPromises = [...usersFromReq, ...usersFromOthers];
  const users = await Promise.all(usersPromises);

  const filtered = users.filter(async (user) => {
    if (!user) return false;
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
  });
  return filtered;
}

async function getUsersOutcomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friends")
    .withIndex("requesting_user_id", (q) => q.eq("requesting_user_id", userId));

  const onlyRequests = ids.filterWith(async (id) => {
    if (id.status === "request_sent") return true;
    return false;
  });

  const users = onlyRequests.flatMap(
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
async function getUsersIncomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friends")
    .withIndex("receiving_user_id", (q) => q.eq("receiving_user_id", userId));

  const onlyRequests = ids.filterWith(async (id) => {
    if (id.status === "request_sent") return true;
    return false;
  });

  const users = onlyRequests.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) =>
          q.eq("_id", requestRecord.requesting_user_id),
        )
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

async function getNotFriends({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const sent = await ctx.db
    .query("friends")
    .withIndex("requesting_user_id", (q) => q.eq("requesting_user_id", userId))
    .collect();
  const received = await ctx.db
    .query("friends")
    .withIndex("receiving_user_id", (q) => q.eq("receiving_user_id", userId))
    .collect();

  // 2. Collect all friend user IDs
  const friendIds = new Set([
    ...sent.map((f) => f.receiving_user_id),
    ...received.map((f) => f.requesting_user_id),
    userId,
  ]);

  if (searchRan) {
    return searchedUsers.filter((u) => u._id && !friendIds.has(u._id));
  }
  const allUsers = await ctx.db.query("users").collect();
  return allUsers.filter((u) => u._id && !friendIds.has(u._id));
}
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
        q.eq("requesting_user_id", userId).eq("receiving_user_id", friendId),
      )
      .first();

    const friendSideReq = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", friendId).eq("receiving_user_id", userId),
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
