import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const usersRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return {
      ok: true,
    };
  }),
});
