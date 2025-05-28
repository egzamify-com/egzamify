import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { session, user, account, verification } from "./db/schema/auth-schema";

const auth = betterAuth({
  plugins: [username(), nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
});

export default auth;
