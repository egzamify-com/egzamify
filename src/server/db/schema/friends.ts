import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

type FriendRequestStatus = "request_sent" | "accepted" | "rejected";

export const friend = pgTable("friends", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  requesting_user_id: text("requesting_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  receiving_user_id: text("receiving_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status")
    .$type<FriendRequestStatus>()
    .notNull()
    .default("request_sent"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
export const friendsRelations = relations(friend, ({ many, one }) => ({
  requestingUser: one(user, {
    fields: [friend.requesting_user_id],
    references: [user.id],
  }),

  receivingUser: one(user, {
    fields: [friend.receiving_user_id],
    references: [user.id],
  }),
}));
