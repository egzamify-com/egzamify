import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { aiWyjasniaRouter } from "./routers/ai-wyjasnia";
import { currentUserRouter } from "./routers/currentUser";
import { qualificationsRouter } from "./routers/qualifications";
import { questionsRouter } from "./routers/questions";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  currentUser: currentUserRouter,
  users: usersRouter,
  qualifications: qualificationsRouter,
  questions: questionsRouter,
  aiWyjasnia: aiWyjasniaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
