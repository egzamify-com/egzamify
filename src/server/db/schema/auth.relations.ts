import { relations } from "drizzle-orm";
import { explanations } from "./ai-wyjasnia";
import { user } from "./auth.schema";
import { friend } from "./friends";

export const userRelations = relations(user, ({ many }) => ({
  explanation: many(explanations),
  requestingFriend: many(friend, { relationName: "requestingUser" }),
  receivingFriend: many(friend, { relationName: "receivingUser" }),
}));
export type UserType = typeof user.$inferSelect;
