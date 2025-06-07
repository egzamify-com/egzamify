import { TRPCError } from "@trpc/server";
import { error } from "console";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
export const qualificationsRouter = createTRPCRouter({
  getQualificationsList: protectedProcedure.query(async () => {
    const qualifications = await db.query.qualifications.findMany({
      with: {
        questions: {
          with: {
            answers: true,
          },
        },
      },
    });
    console.log(qualifications);

    // throw new TRPCError({ code: "UNAUTHORIZED", message: "Brak Autoryzacji" });

    return {
      qualifications,
    };
  }),
});
