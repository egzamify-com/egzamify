import { drizzle } from "drizzle-orm/postgres-js";
import { err, ok, ResultAsync } from "neverthrow";
import postgres from "postgres";
import { env } from "~/env";
import { tryCatch } from "~/utils/tryCatch";
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

type DatabaseQueryError = { type: "FAILED_TO_FETCH"; error: Error };

export async function executeQuery<T>(
  query: Promise<T>,
): Promise<ResultAsync<Awaited<T>, DatabaseQueryError>> {
  const [data, error] = await tryCatch(query);
  if (error) {
    console.log("[EXEC DB QUERY ERROR] - ", error);
    return err({ type: "FAILED_TO_FETCH", error });
  }

  return ok(data as Awaited<T>);
}
