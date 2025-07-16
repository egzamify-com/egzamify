import { defineTable } from "convex/server";
import { v } from "convex/values";
import { z } from "zod";

export const AiResponseWithFollowUpQuesionSchema = z.object({
  aiResponse: z.string(),
  userPrompt: z.string(),
  mode: z.string(),
});
export type AiResponseWithFollowUpQuesion = z.infer<
  typeof AiResponseWithFollowUpQuesionSchema
>;

// export const explanations = pgTable("explanations", {
//   id: uuid("id").notNull().primaryKey().defaultRandom(),
//   user_id: text("user_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

//   created_at: timestamp("created_at").defaultNow().notNull(),
//   aiResponsesWithQuestions: json("aiResponsesWithQuestions")
//     .$type<AiResponseWithFollowUpQuesion[]>()
//     .notNull(),
// });

// export const explanationsRelations = relations(explanations, ({ one }) => ({
//   user: one(user, {
//     fields: [explanations.user_id],
//     references: [user.id],
//   }),
// }));

export const explanations = defineTable({
  user_id: v.id("users"),
  chatId: v.string(),
  content: v.string(),
})
  .index("by_user", ["user_id"])
  .index("by_chat_id", ["chatId"]);
