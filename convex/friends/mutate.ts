import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const cancelFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const document = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", userId).eq("receiving_user_id", friendId),
      )
      .first();

    if (!document) throw new Error("Friend request not found");

    void (await ctx.db.delete(document._id));
  },
});
export const deleteFriend = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    console.log("userid used - ", userId);
    console.log("friendId userd- ", friendId);

    const friendRecordFromUser = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", userId).eq("receiving_user_id", friendId),
      )
      .first();
    const friendRecordFromFriend = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", friendId).eq("receiving_user_id", userId),
      )
      .first();

    console.log("user side ", friendRecordFromUser);
    console.log("friend side ", friendRecordFromFriend);

    // delete the friend record based on who initiated the friend request
    if (friendRecordFromUser && !friendRecordFromFriend) {
      void (await ctx.db.delete(friendRecordFromUser._id));
    } else if (friendRecordFromFriend && !friendRecordFromUser) {
      void (await ctx.db.delete(friendRecordFromFriend._id));
    }
  },
});
export const rejectFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get current user");

    console.log("user id used - ", userId);
    console.log("friend id used - ", friendId);

    const friendRequest = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", friendId).eq("receiving_user_id", userId),
      )
      .first();
    console.log("req found  - ", friendRequest);

    if (!friendRequest) throw new Error("Failed to find friend request");

    if (friendRequest.status != "request_sent")
      throw new Error("Friend already accepted");

    void (await ctx.db.delete(friendRequest._id));
  },
});

export const acceptFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get current user");

    const friendRequest = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requesting_user_id", friendId).eq("receiving_user_id", userId),
      )
      .first();

    console.log("req found  - ", friendRequest);

    if (!friendRequest) throw new Error("Failed to find friend request");

    if (friendRequest.status != "request_sent")
      throw new Error("Friend already accepted");

    void (await ctx.db.patch(friendRequest._id, { status: "accepted" }));
  },
});
export const sendFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, args) => {
    const { friendId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Failed to get current user");

    void (await ctx.db.insert("friends", {
      requesting_user_id: userId,
      receiving_user_id: friendId,
      status: "request_sent",
      updated_at: Date.now(),
    }));
  },
});
