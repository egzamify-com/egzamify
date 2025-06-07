import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { currentUserRouter } from "./routers/currentUser";
import { usersRouter } from "./routers/users";
import { aiRouter } from "./routers/ai";
import { qualificationsRouter } from "./routers/qualifications";
import { questionsRouter } from "./routers/questions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  currentUser: currentUserRouter,
  users: usersRouter,
  ai: aiRouter,
  qualifications: qualificationsRouter,
  questions: questionsRouter,
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
