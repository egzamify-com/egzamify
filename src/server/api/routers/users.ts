import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, isNull, not, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db, executeQuery } from "~/server/db";
import { user } from "~/server/db/schema/auth.schema";
import { friend } from "~/server/db/schema/friends";

const FriendsFiltersSchema = z.enum([
  "not_friends",
  "accepted_friends",
  "incoming_requests",
  "pending_requests",
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
          auth: {
            user: { id: currentUserId },
          },
        },
      }) => {
        const offset = input.cursor ?? 0; // page
        const limit = input.limit ?? 2; //page size
        const searchTerm =
          input.search.trim().length > 0 ? `%${input.search}%` : "%%";

        console.log("seaching for ->", `${searchTerm}`);
        console.log("quering with -> ", `currentUserID${currentUserId}`);
        console.log("quering for -> ", input.filter);

        let queryUsers;
        let queryError;

        switch (input.filter) {
          case "accepted_friends":
            const friends = await executeQuery(
              getCurrentUsersFriendsQuery(
                currentUserId,
                limit,
                offset,
                searchTerm,
              ),
            );
            if (friends.isErr()) queryError = friends.error;
            if (friends.isOk()) queryUsers = friends.value;

            break;
          case "not_friends":
            const noFriends = await executeQuery(
              getNotFriendsQuery(currentUserId, limit, offset, searchTerm),
            );
            if (noFriends.isErr()) queryError = noFriends.error;
            if (noFriends.isOk()) queryUsers = noFriends.value;
            break;
          case "incoming_requests":
            const incomingReq = await executeQuery(
              getCurrentUsersIncomingRequestsQuery(
                currentUserId,
                limit,
                offset,
                searchTerm,
              ),
            );
            if (incomingReq.isErr()) queryError = incomingReq.error;
            if (incomingReq.isOk()) queryUsers = incomingReq.value;
            break;
          case "pending_requests":
            const pendingReq = await executeQuery(
              getCurrentUsersPendingRequestsQuery(
                currentUserId,
                limit,
                offset,
                searchTerm,
              ),
            );
            if (pendingReq.isErr()) queryError = pendingReq.error;
            if (pendingReq.isOk()) queryUsers = pendingReq.value;
            break;
        }

        if (queryError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        if (!queryUsers || queryUsers.length === 0) {
          return {
            items: [],
            nextCursor: undefined,
          };
        }
        console.log("query users:", queryUsers);

        // Determine if there's a next page
        let nextCursor: typeof input.cursor | undefined = undefined;
        if (queryUsers && queryUsers.length > limit) {
          // If we fetched more than the limit, it means there's a next page
          queryUsers.pop(); // Remove the extra item
          nextCursor = offset + limit; // The offset for the next page
        }

        return {
          items: queryUsers,
          nextCursor: nextCursor, // This is the single nextCursor for the entire page
        };
      },
    ),

  getUserDataFromUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input: { username }, ctx: { db } }) => {
      const getUserFromUsername = db.query.user.findFirst({
        where: () => eq(user.username, username),
      });
      const result = await executeQuery(getUserFromUsername);

      if (result.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: result.error,
        });
      }

      if (!result.value) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return result.value;
    }),
});

const getCurrentUsersFriendsQuery = (
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) =>
  db
    .select()
    .from(friend)
    .innerJoin(
      user,
      or(
        // Scenario 1: Current user is requester, friend is receiver
        and(
          eq(friend.requestingUserId, currentUserId),
          eq(friend.receivingUserId, user.id), // Friend is the receiver
        ),
        // Scenario 2: Current user is receiver, friend is requester
        and(
          eq(friend.receivingUserId, currentUserId),
          eq(friend.requestingUserId, user.id), // Friend is the requester
        ),
      ),
    )
    .where(
      and(
        eq(friend.status, "accepted"),
        or(ilike(user.name, searchTerm), ilike(user.username, searchTerm)),
      ),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);

const getNotFriendsQuery = (
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) =>
  db
    .select()
    .from(user)
    .leftJoin(
      friend, // LEFT JOIN with the aliased friend table
      and(
        // The ON clause defines *any* friendship record that exists between `user.id` and `currentUserId`
        // `user.id` is one participant in the friendship record
        or(
          eq(friend.requestingUserId, user.id),
          eq(friend.receivingUserId, user.id), // Ensure this column name matches your schema
        ),
        // `currentUserId` is the other participant in the friendship record
        or(
          eq(friend.requestingUserId, currentUserId),
          eq(friend.receivingUserId, currentUserId), // Ensure this column name matches your schema
        ),
        // Crucially, only consider *accepted* friendships here for the JOIN
        // eq(friend.status, "accepted"),
      ),
    )
    .where(
      and(
        or(ilike(user.name, searchTerm), ilike(user.username, searchTerm)),
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

const getCurrentUsersIncomingRequestsQuery = (
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) =>
  db
    .select()
    .from(friend)
    .innerJoin(
      user,

      // Scenario 2: Current user is receiver, friend is requester
      and(
        eq(friend.receivingUserId, currentUserId),
        eq(friend.requestingUserId, user.id), // Friend is the requester
      ),
    )
    .where(
      and(
        eq(friend.status, "request_sent"),

        or(ilike(user.name, searchTerm), ilike(user.username, searchTerm)),
      ),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);

const getCurrentUsersPendingRequestsQuery = (
  currentUserId: string,
  limit: number,
  offset: number,
  searchTerm: string,
) =>
  db
    .select()
    .from(friend)
    .innerJoin(
      user,
      and(
        eq(friend.requestingUserId, currentUserId),
        eq(friend.receivingUserId, user.id), // Friend is the requester
      ),
    )
    .where(
      and(
        eq(friend.status, "request_sent"),
        or(ilike(user.name, searchTerm), ilike(user.username, searchTerm)),
      ),
    )
    .orderBy(desc(user.email))
    .offset(offset)
    .limit(limit + 1);
