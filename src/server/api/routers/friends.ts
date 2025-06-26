import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { friend } from "~/server/db/schema/friends";
import { tryCatch } from "~/utils/tryCatch";
import type { FriendsFilter } from "./users";

export const friendsRouter = createTRPCRouter({
  getCurrentUsersFriends: protectedProcedure.query(
    async ({ ctx: { auth, db } }) => {
      const currentUserId = auth.user.id;
      const [friends, friendsError] = await tryCatch(
        db.query.friend.findMany({
          where: () =>
            and(
              or(
                eq(friend.receiving_user_id, currentUserId),
                eq(friend.requesting_user_id, currentUserId),
              ),
              eq(friend.status, "accepted"),
            ),
          with: {
            receivingUser: true,
            requestingUser: true,
          },
        }),
      );
      console.log(friends);

      if (friendsError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: friendsError.message,
        });
      }
      if (friends.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No friends found" });
      }
      //  get rid of current user, return only actual friends
      const people = friends?.map((friend) => {
        return {
          user:
            friend.requesting_user_id === currentUserId
              ? friend.receivingUser
              : friend.requestingUser,
          updated_at: friend.updated_at,
          created_at: friend.created_at,
          status: friend.status,
        };
      });
      return people;
    },
  ),
  deleteFriend: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(
      async ({
        ctx: {
          auth: {
            user: { id: currentUserId },
          },
          db,
        },
        input: { friendId },
      }) => {
        const [result, error] = await tryCatch(
          db
            .delete(friend)
            .where(
              or(
                and(
                  eq(friend.requesting_user_id, currentUserId),
                  eq(friend.receiving_user_id, friendId),
                ),
                and(
                  eq(friend.requesting_user_id, friendId),
                  eq(friend.receiving_user_id, currentUserId),
                ),
              ),
            ),
        );
        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error?.message,
            message: error?.message,
          });
        }
        return {
          message: "Friend deleted successfully",
        };
      },
    ),

  sentFriendRequest: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(
      async ({
        ctx: {
          auth: {
            user: { id: currentUserId },
          },
          db,
        },
        input: { friendId },
      }) => {
        const [result, error] = await tryCatch(
          db.insert(friend).values({
            requesting_user_id: currentUserId,
            receiving_user_id: friendId,
            status: "request_sent",
          }),
        );
        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error?.message,
            message: error?.message,
          });
        }
        return {
          message: "Friend added successfully",
        };
      },
    ),
  acceptRequest: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(async ({ ctx: { db }, input: { friendId } }) => {
      const [result, error] = await tryCatch(
        db
          .update(friend)
          .set({ status: "accepted" })
          .where(eq(friend.requesting_user_id, friendId)),
      );
      if (error || !result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: error?.message,
          message: error?.message,
        });
      }
      return {
        message: "Friend accepted successfully",
      };
    }),

  cancelRequest: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(
      async ({
        ctx: {
          auth: {
            user: { id: currentUserId },
          },
          db,
        },
        input: { friendId },
      }) => {
        const [result, error] = await tryCatch(
          db
            .delete(friend)
            .where(
              or(
                and(
                  eq(friend.requesting_user_id, currentUserId),
                  eq(friend.receiving_user_id, friendId),
                ),
                and(
                  eq(friend.requesting_user_id, friendId),
                  eq(friend.receiving_user_id, currentUserId),
                ),
              ),
            ),
        );
        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error?.message,
            message: error?.message,
          });
        }
        return {
          message: "Friend request cancelled successfully",
        };
      },
    ),
  rejectRequest: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(
      async ({
        ctx: {
          auth: {
            user: { id: currentUserId },
          },
          db,
        },
        input: { friendId },
      }) => {
        const [result, error] = await tryCatch(
          db
            .delete(friend)
            .where(
              and(
                eq(friend.requesting_user_id, friendId),
                eq(friend.receiving_user_id, currentUserId),
              ),
            ),
        );
        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error?.message,
            message: error?.message,
          });
        }
        return {
          message: "Friend request rejected successfully",
        };
      },
    ),
  checkFriendshipStatus: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .query(
      async ({
        ctx: {
          auth: {
            user: { id: currentUserId },
          },
        },
        input: { friendId },
      }) => {
        const [result, error] = await tryCatch(
          checkFriendshipStatus(friendId, currentUserId),
        );
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error?.message,
            message: error?.message,
          });
        }
        console.log("fired!!");
        return result;
      },
    ),
});
async function checkFriendshipStatus(
  friendId: string,
  currentUserId: string,
): Promise<{ status: FriendsFilter }> {
  const dbResult = await db.query.friend.findFirst({
    where: () =>
      or(
        and(
          eq(friend.requesting_user_id, friendId),
          eq(friend.receiving_user_id, currentUserId),
        ),
        and(
          eq(friend.requesting_user_id, currentUserId),
          eq(friend.receiving_user_id, friendId),
        ),
      ),
  });

  if (
    dbResult?.requesting_user_id === currentUserId &&
    dbResult.status === "request_sent"
  ) {
    return {
      status: "pending_requests",
    };
  }
  if (
    dbResult?.requesting_user_id === friendId &&
    dbResult.status === "request_sent"
  ) {
    return {
      status: "incoming_requests",
    };
  }

  if (
    (dbResult?.requesting_user_id === currentUserId &&
      dbResult.status === "accepted") ||
    (dbResult?.requesting_user_id === friendId &&
      dbResult.status === "accepted")
  ) {
    return {
      status: "accepted_friends",
    };
  }

  return {
    status: "not_friends",
  };
}
