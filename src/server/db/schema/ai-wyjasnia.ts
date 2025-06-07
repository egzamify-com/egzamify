import { relations } from "drizzle-orm";
import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { user } from "./auth.schema";
export type AiResponseWithFollowUpQuesion = {
  aiResponse: string;
  followUpQuestion: string;
};
export const AiResponseWithFollowUpQuesionSchma = z.object({
  aiResponse: z.string(),
  followUpQuestion: z.string(),
});

export const explanations = pgTable("explanations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userPrompt: text("userPrompt").notNull(),
  mode: text("mode").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  aiResponsesWithQuestions: json("aiResponsesWithQuestions"),
});

export const explanationsRelations = relations(explanations, ({ one }) => ({
  user: one(user),
}));
