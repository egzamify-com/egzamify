import { pgTableCreator, text } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `ai_learning_platform_${name}`);

export const users = pgTable("users", {
  user_id: text("user_id").notNull().primaryKey(),
  first_name: text("name"),
  last_name: text("last_name"),
  username: text("username").notNull().unique(),
});
