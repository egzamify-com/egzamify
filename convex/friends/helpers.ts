import { stream } from "convex-helpers/server/stream";
import schema from "../schema";
import { type FriendsQueryInfo } from "./query";

export async function getUsersFriends({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const fromRequestsRecords = await ctx.db
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
    .collect();

  const fromOthersRecords = await ctx.db
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
    .collect();

  const usersFromReq = fromRequestsRecords
    .filter((friendRecord) => {
      if (friendRecord.status === "accepted") return true;
    })
    .map((friendRecord) => {
      const user = ctx.db.get(friendRecord.receivingUserId);
      return user;
    });

  const usersFromOthers = fromOthersRecords
    .filter((friendRecord) => {
      if (friendRecord.status === "accepted") return true;
    })
    .map((friendRecord) => {
      const user = ctx.db.get(friendRecord.requestingUserId);
      return user;
    });

  const usersPromises = [...usersFromReq, ...usersFromOthers];
  const users = await Promise.all(usersPromises);

  const filtered = users.filter((user) => {
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

export async function getUsersOutcomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId));

  const onlyRequests = ids.filterWith(async (id) => {
    if (id.status === "request_sent") return true;
    return false;
  });

  const users = onlyRequests.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", requestRecord.receivingUserId))
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
export async function getUsersIncomingRequests({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId));

  const onlyRequests = ids.filterWith(async (id) => {
    if (id.status === "request_sent") return true;
    return false;
  });

  const users = onlyRequests.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", requestRecord.requestingUserId))
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

export async function getNotFriends({
  ctx,
  userId,
  searchedUsers,
  searchRan,
}: FriendsQueryInfo) {
  const sent = await ctx.db
    .query("friends")
    .withIndex("requestingUserId", (q) => q.eq("requestingUserId", userId))
    .collect();
  const received = await ctx.db
    .query("friends")
    .withIndex("receivingUserId", (q) => q.eq("receivingUserId", userId))
    .collect();

  // 2. Collect all friend user IDs
  const friendIds = new Set([
    ...sent.map((f) => f.receivingUserId),
    ...received.map((f) => f.requestingUserId),
    userId,
  ]);

  if (searchRan) {
    return searchedUsers.filter((u) => u._id && !friendIds.has(u._id));
  }
  const allUsers = await ctx.db.query("users").collect();
  return allUsers.filter((u) => u._id && !friendIds.has(u._id));
}
