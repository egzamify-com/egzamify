import { type Config } from "drizzle-kit";
import { pgTableCreator } from "drizzle-orm/pg-core";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["ai-learning-platform_*"],
} satisfies Config;

export const pgTable = pgTableCreator((name) => `ai_learning_platform_${name}`);
