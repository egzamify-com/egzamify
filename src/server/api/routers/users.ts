import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, isNull, not, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { user } from "~/server/db/schema/auth.schema";
import { friend } from "~/server/db/schema/friends";
import { tryCatch } from "~/utils/tryCatch";

const FriendsFiltersSchema = z.enum([
  "not_friends",
  "accepted_friends",
  "incoming_requests",
  "pending_requests",
  "rejected_requests",
]);
export type FriendsFilter = z.infer<typeof FriendsFiltersSchema>;

export const usersRouter = createTRPCRouter({
  getUsersFromSearch: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        filter: FriendsFiltersSchema,
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
        const searchTerm =
          input.search.trim().length > 0 ? `%${input.search}%` : "%%";

        // const baseFilters = {
        //   orderBy: [user.email], // Or any other sorting for consistency
        //   limit: limit + 1, // Fetch one more than limit to check if there's a next page
        //   offset: offset,
        // };
        console.log("seaching for ->", `${searchTerm}`);
        console.log("quering with -> ", `currentUserID${currentUserId}`);
        console.log("quering for -> ", input.filter);
        // const [currentUsersFriendsIds, currentUsersFriendsError] =
        //   await tryCatch(getCurrentUsersFriendsIds(currentUserId));

        // if (currentUsersFriendsError) {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     cause: currentUsersFriendsError.cause,
        //     message: currentUsersFriendsError.message,
        //   });
        // }
        let queryUsers;
        let queryError;

        switch (input.filter) {
          case "accepted_friends":
            [queryUsers, queryError] = await tryCatch(
              getCurrentUsersFriends(currentUserId, limit, offset, searchTerm),
            );
            break;
          case "not_friends":
            [queryUsers, queryError] = await tryCatch(
              getNotFriends(currentUserId, limit, offset, searchTerm),
            );
            break;
          case "incoming_requests":
            [queryUsers, queryError] = await tryCatch(
              getCurrentUsersIncomingRequests(
                currentUserId,
                limit,
                offset,
                searchTerm,
              ),
            );
            break;
          case "pending_requests":
            [queryUsers, queryError] = await tryCatch(
              getCurrentUsersPendingRequests(
                currentUserId,
                limit,
                offset,
                searchTerm,
              ),
            );
            break;
        }

        if (queryError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: queryError.cause,
            message: queryError.message,
          });
        }
        if (!queryUsers || queryUsers.length === 0) {
          return {
            items: [],
            nextCursor: undefined,
          };
        }
        console.log("query error:", queryError);
        console.log("query users:", queryUsers);
        // if (!searchTerm) {
        //   // If no search term, return all users (with pagination)
        //   [queryUsers, queryError] = await tryCatch(
        //     db.query.user.findMany({
        //       orderBy: [user.email], // Or any other sorting for consistency
        //       limit: limit + 1, // Fetch one more than limit to check if there's a next page
        //       offset: offset,
        //     }),
        //   );
        // } else {
        //   // Otherwise, perform the search with `ilike` and `or`
        //   [queryUsers, queryError] = await tryCatch(
        //     db.query.user.findMany({
        //       where: (usersTable, { ilike, or }) =>
        //         or(
        //           ilike(usersTable.username, `%${searchTerm}%`),
        //           ilike(usersTable.email, `%${searchTerm}%`),
        //           // Add other fields as needed
        //         ),
        //       orderBy: [user.email], // Or any other sorting for consistency
        //       limit: limit + 1, // Fetch one more than limit to check if there's a next page
        //       offset: offset,
        //     }),
        //   );
        // }

        // if (queryError) {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     cause: queryError.cause,
        //     message: queryError.message,
        //   });
        // }

        // Determine if there's a next page
        let nextCursor: typeof input.cursor | undefined = undefined;
        if (queryUsers && queryUsers.length > limit) {
          // If we fetched more than the limit, it means there's a next page
          queryUsers.pop(); // Remove the extra item
          nextCursor = offset + limit; // The offset for the next page
        }

        // const usersWithFriendStatus =
        //   queryUsers?.map((user) => ({
        //     ...user,
        //     isFriendWithCurrentUser: currentUsersFriendsIds.includes(user.id),
        //   })) ?? [];

        // const onlyUsersFriends = usersWithFriendStatus.filter(
        //   (user) => user.isFriendWithCurrentUser,
        // );

        return {
          items: queryUsers,
          nextCursor: nextCursor, // This is the single nextCursor for the entire page
        };
      },
    ),
});
// async function getCurrentUsersFriendsIds(currentUserId: string) {
//   const [currentUsersFriendsFromRequest, currentUsersFriendsFromRequestError] =
//     await tryCatch(
//       db.query.friend.findMany({
//         columns: {},
//         where: () => eq(friend.requesting_user_id, currentUserId),
//         with: {
//           receivingUser: {
//             columns: {
//               id: true,
//             },
//           },
//         },
//       }),
//     );
//   const [currentUsersFriendsFromReceive, currentUsersFriendsFromReceiveError] =
//     await tryCatch(
//       db.query.friend.findMany({
//         columns: {},
//         where: () => eq(friend.receiving_user_id, currentUserId),
//         with: {
//           requestingUser: {
//             columns: {
//               id: true,
//             },
//           },
//         },
//       }),
//     );

//   if (currentUsersFriendsFromRequestError) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       cause: currentUsersFriendsFromRequestError.cause,
//       message: currentUsersFriendsFromRequestError.message,
//     });
//   }
//   if (currentUsersFriendsFromReceiveError) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       cause: currentUsersFriendsFromReceiveError.cause,
//       message: currentUsersFriendsFromReceiveError.message,
//     });
//   }

//   const fromReqIds = currentUsersFriendsFromRequest?.map(
//     (user) => user.receivingUser.id,
//   );
//   const fromRecIds = currentUsersFriendsFromReceive?.map(
//     (user) => user.requestingUser.id,
//   );

//   return [...fromReqIds, ...fromRecIds];
// }
async function getCurrentUsersFriends(
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) {
  return await db
    .select()
    .from(friend)
    .innerJoin(
      user,
      or(
        // Scenario 1: Current user is requester, friend is receiver
        and(
          eq(friend.requesting_user_id, currentUserId),
          eq(friend.receiving_user_id, user.id), // Friend is the receiver
        ),
        // Scenario 2: Current user is receiver, friend is requester
        and(
          eq(friend.receiving_user_id, currentUserId),
          eq(friend.requesting_user_id, user.id), // Friend is the requester
        ),
      ),
    )
    .where(and(eq(friend.status, "accepted"), ilike(user.email, searchTerm)))
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);
}
async function getNotFriends(
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) {
  return await db
    .select()
    .from(user)
    .leftJoin(
      friend, // LEFT JOIN with the aliased friend table
      and(
        // The ON clause defines *any* friendship record that exists between `user.id` and `currentUserId`
        // `user.id` is one participant in the friendship record
        or(
          eq(friend.requesting_user_id, user.id),
          eq(friend.receiving_user_id, user.id), // Ensure this column name matches your schema
        ),
        // `currentUserId` is the other participant in the friendship record
        or(
          eq(friend.requesting_user_id, currentUserId),
          eq(friend.receiving_user_id, currentUserId), // Ensure this column name matches your schema
        ),
        // Crucially, only consider *accepted* friendships here for the JOIN
        eq(friend.status, "accepted"),
      ),
    )
    .where(
      and(
        ilike(user.email, searchTerm),
        and(
          // CONDITION A: The core logic for "NOT friends" - ensures NO matching 'f' record was found
          isNull(friend.id), // If f.id is NULL, it means no friendship record exists between user.id and currentUserId (of status 'accepted')

          // CONDITION B: Exclude the current user themselves from the results
          not(eq(user.id, currentUserId)),
        ),
      ),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);
}
async function getCurrentUsersIncomingRequests(
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) {
  return await db
    .select()
    .from(friend)
    .innerJoin(
      user,

      // Scenario 2: Current user is receiver, friend is requester
      and(
        eq(friend.receiving_user_id, currentUserId),
        eq(friend.requesting_user_id, user.id), // Friend is the requester
      ),
    )
    .where(
      and(eq(friend.status, "request_sent"), ilike(user.email, searchTerm)),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);
}
async function getCurrentUsersPendingRequests(
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) {
  return await db
    .select()
    .from(friend)
    .innerJoin(
      user,
      and(
        eq(friend.requesting_user_id, currentUserId),
        eq(friend.receiving_user_id, user.id), // Friend is the requester
      ),
    )
    .where(
      and(eq(friend.status, "request_sent"), ilike(user.email, searchTerm)),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);
}
