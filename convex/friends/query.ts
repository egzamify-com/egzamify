import { getAuthUserId } from "@convex-dev/auth/server";
import { stream } from "convex-helpers/server/stream";
import { paginationOptsValidator } from "convex/server";
import { Infer, v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import schema from "../schema";
export const friendFilterValidator = v.union(
  // v.literal("not_friends"),
  v.literal("accepted_friends"),
  // v.literal("incoming_requests"),
  v.literal("outcoming_requests"),
);
export const getFriendsWithSearch = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    filter: friendFilterValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get user");

    const { search, filter, paginationOpts } = args;
    const queryInfo: FriendsQueryInfo = {
      ctx,
      userId,
      paginationOpts,
    };
    switch (filter) {
      case "accepted_friends":
        return await getUsersFriends(queryInfo);
      case "outcoming_requests":
        return await getUsersOutcomingRequests(queryInfo);
    }
  },
});
type FriendsQueryInfo = {
  ctx: QueryCtx;
  userId: Id<"users">;
  paginationOpts: Infer<typeof paginationOptsValidator>;
};
async function getUsersFriends({
  ctx,
  userId,
  paginationOpts,
}: FriendsQueryInfo) {
  const friendIds = stream(ctx.db, schema)
    .query("acceptedFriends")
    .withIndex("user_id", (q) => q.eq("user_id", userId));

  const friends = friendIds.flatMap(
    async (friendRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", friendRecord.friend_id)),
    ["_id"],
  );
  return friends.paginate(paginationOpts);
}

async function getUsersOutcomingRequests({
  ctx,
  userId,
  paginationOpts,
}: FriendsQueryInfo) {
  const ids = stream(ctx.db, schema)
    .query("friendRequests")
    .withIndex("requesting_user_id", (q) => q.eq("requesting_user_id", userId));

  const users = ids.flatMap(
    async (requestRecord) =>
      stream(ctx.db, schema)
        .query("users")
        .withIndex("by_id", (q) =>
          q.eq("_id", requestRecord.receiving_user_id),
        ),
    ["_id"],
  );

  return users.paginate(paginationOpts);
}
