import { relations } from "drizzle-orm";
import { boolean, char, index, integer, text, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle.config";

// ----------------QUALIFICATIONS----------------------
export const qualifications = pgTable(
  "qualifications",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    label: text("label").notNull().unique(),
  },
  (table) => [index("id_idx").on(table.id), index("label_idx").on(table.label)],
);

export const qualificationsRelations = relations(
  qualifications,
  ({ many }) => ({
    questions: many(questions),
  }),
);

// ----------------QUESTIONS----------------------
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    qualification_id: uuid("qualification_id")
      .notNull()
      .references(() => qualifications.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    year: integer("year").notNull(),
    image_url: text("image_url"),
  },
  (table) => [
    index("id_idx").on(table.id),
    index("qualification_id_idx").on(table.qualification_id),
  ],
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  qualification: one(qualifications, {
    fields: [questions.qualification_id],
    references: [qualifications.id],
  }),
  answers: many(answers),
}));
// ----------------ANSWERS----------------------
export const answers = pgTable(
  "answers",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    question_id: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    image_url: text("image_url"),
    isCorrect: boolean("isCorrect").notNull(),
    label: char("label").notNull(),
  },
  (table) => [
    index("id_idx").on(table.id),
    index("question_id_idx").on(table.question_id),
  ],
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.question_id],
    references: [questions.id],
  }),
}));
