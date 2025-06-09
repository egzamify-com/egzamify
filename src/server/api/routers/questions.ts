import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { eq, sql } from "drizzle-orm";
import { questions } from "~/server/db/schema/teoria";

export const questionsRouter = createTRPCRouter({
  getQuestionsByQualification: publicProcedure
    .input(z.object({ qualificationId: z.string().uuid() }))
    .query(async ({ input }) => {
      const questionsData = await db.query.questions.findMany({
        where: eq(questions.qualification_id, input.qualificationId),
        with: {
          answers: {
            orderBy: (answers, { asc }) => [asc(answers.label)],
          },
        },
        orderBy: (questions, { asc }) => [asc(questions.created_at)],
      });

      return {
        questions: questionsData.map((question) => ({
          id: question.id,
          question: question.content,
          answers: question.answers.map((answer) => answer.content),
          correctAnswer: question.answers.findIndex(
            (answer) => answer.is_correct,
          ),
          explanation: `Wyjaśnienie dla pytania: ${question.content}`,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: question.answers.map((answer) => answer.label),
        })),
      };
    }),

  // Pobierz losowe pytanie dla kwalifikacji
  getRandomQuestion: publicProcedure
    .input(z.object({ qualificationId: z.string().uuid() }))
    .query(async ({ input }) => {
      const randomQuestion = await db.query.questions.findFirst({
        where: eq(questions.qualification_id, input.qualificationId),
        with: {
          answers: {
            orderBy: (answers, { asc }) => [asc(answers.label)],
          },
        },
        orderBy: sql`RANDOM()`,
      });

      if (!randomQuestion) {
        return { question: null };
      }

      return {
        question: {
          id: randomQuestion.id,
          question: randomQuestion.content,
          answers: randomQuestion.answers.map((answer) => answer.content),
          correctAnswer: randomQuestion.answers.findIndex(
            (answer) => answer.is_correct,
          ),
          explanation: `Wyjaśnienie dla pytania: ${randomQuestion.content}`,
          year: randomQuestion.year,
          imageUrl: randomQuestion.image_url,
          answerLabels: randomQuestion.answers.map((answer) => answer.label),
        },
      };
    }),

  // Pobierz pytania z filtrowaniem i wyszukiwaniem
  getBrowseQuestions: publicProcedure
    .input(
      z.object({
        qualificationId: z.string().uuid(),
        search: z.string().optional(),
        year: z.number().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      let whereCondition = eq(
        questions.qualification_id,
        input.qualificationId,
      );

      // Dodaj więcej warunków filtrowania jeśli potrzebujesz
      if (input.year) {
        whereCondition = sql`${whereCondition} AND ${questions.year} = ${input.year}`;
      }

      const questionsData = await db.query.questions.findMany({
        where: whereCondition,
        with: {
          answers: {
            orderBy: (answers, { asc }) => [asc(answers.label)],
          },
        },
        limit: input.limit,
        offset: input.offset,
        orderBy: (questions, { desc }) => [desc(questions.created_at)],
      });

      // Filtrowanie po tekście (można to przenieść do SQL jeśli potrzebujesz)
      let filteredQuestions = questionsData;
      if (input.search) {
        filteredQuestions = questionsData.filter((q) =>
          q.content.toLowerCase().includes(input.search!.toLowerCase()),
        );
      }

      return {
        questions: filteredQuestions.map((question) => ({
          id: question.id,
          question: question.content,
          answers: question.answers.map((answer) => answer.content),
          correctAnswer: question.answers.findIndex(
            (answer) => answer.is_correct,
          ),
          explanation: `Wyjaśnienie dla pytania: ${question.content}`,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: question.answers.map((answer) => answer.label),
          category: `Rok ${question.year}`,
          difficulty: "Średni",
        })),
        total: filteredQuestions.length,
      };
    }),

  // Pobierz statystyki pytań dla kwalifikacji
  getQuestionsStats: publicProcedure
    .input(z.object({ qualificationId: z.string().uuid() }))
    .query(async ({ input }) => {
      const stats = await db
        .select({
          total: sql<number>`count(*)`,
          years: sql<number[]>`array_agg(DISTINCT ${questions.year})`,
        })
        .from(questions)
        .where(eq(questions.qualification_id, input.qualificationId));

      return {
        total: stats[0]?.total || 0,
        years: stats[0]?.years || [],
      };
    }),
});
