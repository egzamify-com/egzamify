import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { friend } from "~/server/db/schema/friends";
import { tryCatch } from "~/utils/tryCatch";

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
});
