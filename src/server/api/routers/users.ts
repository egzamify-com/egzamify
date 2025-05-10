import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { tryCatch } from "~/utils/tryCatch";

export const usersRouter = createTRPCRouter({
  createUserProfile: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        first_name: z.string().nullish(),
        last_name: z.string().nullish(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const [data, error] = await tryCatch(db.insert(users).values(input));

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return {
        userInserted: data,
        greeting: `Hello ${input}`,
      };
    }),
});
