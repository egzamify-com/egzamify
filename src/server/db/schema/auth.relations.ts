import { relations } from "drizzle-orm";
import { explanations } from "./ai-wyjasnia";
import { user } from "./auth.schema";

export const userRelations = relations(user, ({ many }) => ({
  explanation: many(explanations),
}));
