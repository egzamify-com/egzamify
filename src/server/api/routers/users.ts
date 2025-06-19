import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { user } from "~/server/db/schema/auth.schema";
import { friend } from "~/server/db/schema/friends";
import { tryCatch } from "~/utils/tryCatch";
export const usersRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return {
      ok: true,
    };
  }),
  getUsersFromSearch: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        friendsOnly: z.boolean(),
        cursor: z.number().nullish(),
        limit: z.number().min(1).max(100).nullish(),
      }),
    )
    .query(
      async ({
        input,
        ctx: {
          db,
          auth: {
            user: { id: currentUserId },
          },
        },
      }) => {
        const offset = input.cursor ?? 0; // page
        const limit = input.limit ?? 2; //page size

        console.log("seaching for ", input.search);

        const [currentUsersFriendsIds, currentUsersFriendsError] =
          await tryCatch(getCurrentUsersFriendsIds(currentUserId));

        if (currentUsersFriendsError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: currentUsersFriendsError.cause,
            message: currentUsersFriendsError.message,
          });
        }

        const searchTerm = input.search.trim();

        let queryUsers;
        let queryError;

        if (!searchTerm) {
          // If no search term, return all users (with pagination)
          [queryUsers, queryError] = await tryCatch(
            db.query.user.findMany({
              orderBy: [user.email], // Or any other sorting for consistency
              limit: limit + 1, // Fetch one more than limit to check if there's a next page
              offset: offset,
            }),
          );
        } else {
          // Otherwise, perform the search with `ilike` and `or`
          [queryUsers, queryError] = await tryCatch(
            db.query.user.findMany({
              where: (usersTable, { ilike, or }) =>
                or(
                  ilike(usersTable.username, `%${searchTerm}%`),
                  ilike(usersTable.email, `%${searchTerm}%`),
                  // Add other fields as needed
                ),
              orderBy: [user.email], // Or any other sorting for consistency
              limit: limit + 1, // Fetch one more than limit to check if there's a next page
              offset: offset,
            }),
          );
        }

        if (queryError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: queryError.cause,
            message: queryError.message,
          });
        }

        // Determine if there's a next page
        let nextCursor: typeof input.cursor | undefined = undefined;
        if (queryUsers && queryUsers.length > limit) {
          // If we fetched more than the limit, it means there's a next page
          queryUsers.pop(); // Remove the extra item
          nextCursor = offset + limit; // The offset for the next page
        }

        const usersWithFriendStatus =
          queryUsers?.map((user) => ({
            ...user,
            isFriendWithCurrentUser: currentUsersFriendsIds.includes(user.id),
          })) ?? [];

        const onlyUsersFriends = usersWithFriendStatus.filter(
          (user) => user.isFriendWithCurrentUser,
        );

        return {
          items: input.friendsOnly ? onlyUsersFriends : usersWithFriendStatus,
          nextCursor: nextCursor, // This is the single nextCursor for the entire page
        };
      },
    ),
});
async function getCurrentUsersFriendsIds(currentUserId: string) {
  const [currentUsersFriendsFromRequest, currentUsersFriendsFromRequestError] =
    await tryCatch(
      db.query.friend.findMany({
        columns: {},
        where: () => eq(friend.requesting_user_id, currentUserId),
        with: {
          receivingUser: {
            columns: {
              id: true,
            },
          },
        },
      }),
    );
  const [currentUsersFriendsFromReceive, currentUsersFriendsFromReceiveError] =
    await tryCatch(
      db.query.friend.findMany({
        columns: {},
        where: () => eq(friend.receiving_user_id, currentUserId),
        with: {
          requestingUser: {
            columns: {
              id: true,
            },
          },
        },
      }),
    );

  if (currentUsersFriendsFromRequestError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: currentUsersFriendsFromRequestError.cause,
      message: currentUsersFriendsFromRequestError.message,
    });
  }
  if (currentUsersFriendsFromReceiveError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: currentUsersFriendsFromReceiveError.cause,
      message: currentUsersFriendsFromReceiveError.message,
    });
  }

  const fromReqIds = currentUsersFriendsFromRequest?.map(
    (user) => user.receivingUser.id,
  );
  const fromRecIds = currentUsersFriendsFromReceive?.map(
    (user) => user.requestingUser.id,
  );

  return [...fromReqIds, ...fromRecIds];
}
