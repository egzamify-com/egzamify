import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

type FriendRequestStatus = "request_sent" | "accepted";

export const friend = pgTable(
  "friends",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    requestingUserId: text("requestingUserId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receivingUserId: text("receivingUserId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status")
      .$type<FriendRequestStatus>()
      .notNull()
      .default("request_sent"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("friends_id_idx").on(table.id),
    index("friends_user_id_idx").on(table.requestingUserId),
    index("friends_receivingUserId_idx").on(table.receivingUserId),
    index("friends_status_idx").on(table.status),
  ],
);

export const friendsRelations = relations(friend, ({ one }) => ({
  requestingUser: one(user, {
    relationName: "requestingUser",
    fields: [friend.requestingUserId],
    references: [user.id],
  }),

  receivingUser: one(user, {
    relationName: "receivingUser",
    fields: [friend.receivingUserId],
    references: [user.id],
  }),
}));
