import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

type FriendRequestStatus = "request_sent" | "accepted";

export const friend = pgTable(
  "friends",
  {
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
  },
  (table) => [
    index("friends_id_idx").on(table.id),
    index("friends_user_id_idx").on(table.requesting_user_id),
    index("friends_receiving_user_id_idx").on(table.receiving_user_id),
    index("friends_status_idx").on(table.status),
  ],
);

export const friendsRelations = relations(friend, ({ one }) => ({
  requestingUser: one(user, {
    relationName: "requestingUser",
    fields: [friend.requesting_user_id],
    references: [user.id],
  }),

  receivingUser: one(user, {
    relationName: "receivingUser",
    fields: [friend.receiving_user_id],
    references: [user.id],
  }),
}));
