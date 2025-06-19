import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as explnanationsSchema from "./schema/ai-wyjasnia";
import * as authSchema from "./schema/auth.schema";
import * as friendsSchema from "./schema/friends";
import * as mainSchema from "./schema/teoria";
const schema = {
  ...mainSchema,
  ...authSchema,
  ...friendsSchema,
  ...explnanationsSchema,
};
/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
