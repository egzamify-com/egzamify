import { TRPCError } from "@trpc/server";
import { like } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { user } from "~/server/db/schema/auth.schema";
import { tryCatch } from "~/utils/tryCatch";
export const usersRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return {
      ok: true,
    };
  }),
  getUsersFromSearch: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ input, ctx: { db } }) => {
      console.log("seaching for ", input.search);
      const [result, error] = await tryCatch(
        db.query.user.findMany({
          where: () => like(user.email, `%${input.search}%`),
        }),
      );
      console.log(result);
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: error.cause,
          message: error.message,
        });
      }
      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No users found" });
      }

      return result;
    }),
});
