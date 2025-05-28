import { pgTableCreator, text } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `ai_learning_platform_${name}`);
