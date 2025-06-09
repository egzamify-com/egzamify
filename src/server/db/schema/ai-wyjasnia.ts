import { relations } from "drizzle-orm";
import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { user } from "./auth.schema";

export const AiResponseWithFollowUpQuesionSchema = z.object({
  aiResponse: z.string(),
  userPrompt: z.string(),
  mode: z.string(),
});
export type AiResponseWithFollowUpQuesion = z.infer<
  typeof AiResponseWithFollowUpQuesionSchema
>;

export const explanations = pgTable("explanations", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  created_at: timestamp("created_at").defaultNow().notNull(),
  aiResponsesWithQuestions: json("aiResponsesWithQuestions")
    .$type<AiResponseWithFollowUpQuesion[]>()
    .notNull(),
});

export const explanationsRelations = relations(explanations, ({ one }) => ({
  user: one(user, {
    fields: [explanations.user_id],
    references: [user.id],
  }),
}));
