import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserId } from "../custom_helpers";

export const cancelFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const userId = await getUserId(ctx);

    const document = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", userId).eq("receivingUserId", friendId),
      )
      .first();

    if (!document) throw new Error("Friend request not found");

    await ctx.db.delete(document._id);
  },
});

export const deleteFriend = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const userId = await getUserId(ctx);

    const friendRecordFromUser = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", userId).eq("receivingUserId", friendId),
      )
      .first();
    const friendRecordFromFriend = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", friendId).eq("receivingUserId", userId),
      )
      .first();

    // delete the friend record based on who initiated the friend request
    if (friendRecordFromUser && !friendRecordFromFriend) {
      await ctx.db.delete(friendRecordFromUser._id);
    } else if (friendRecordFromFriend && !friendRecordFromUser) {
      await ctx.db.delete(friendRecordFromFriend._id);
    }
  },
});

export const rejectFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const userId = await getUserId(ctx);

    const friendRequest = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", friendId).eq("receivingUserId", userId),
      )
      .first();

    if (!friendRequest) throw new Error("Failed to find friend request");

    if (friendRequest.status != "request_sent")
      throw new Error("Friend already accepted");

    await ctx.db.delete(friendRequest._id);
  },
});

export const acceptFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const userId = await getUserId(ctx);

    const friendRequest = await ctx.db
      .query("friends")
      .withIndex("from_to", (q) =>
        q.eq("requestingUserId", friendId).eq("receivingUserId", userId),
      )
      .first();

    if (!friendRequest) throw new Error("Failed to find friend request");

    if (friendRequest.status != "request_sent")
      throw new Error("Friend already accepted");

    await ctx.db.patch(friendRequest._id, { status: "accepted" });
  },
});

export const sendFriendRequest = mutation({
  args: { friendId: v.id("users") },
  handler: async (ctx, { friendId }) => {
    const userId = await getUserId(ctx);

    await ctx.db.insert("friends", {
      requestingUserId: userId,
      receivingUserId: friendId,
      status: "request_sent",
      updatedAt: Date.now(),
    });
  },
});
