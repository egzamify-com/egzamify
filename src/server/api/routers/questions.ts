import { groq } from "@ai-sdk/groq";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
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
          explanation: question.explanation,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: question.answers.map((answer) => answer.label),
        })),
      };
    }),

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
          explanation: randomQuestion.explanation,
          year: randomQuestion.year,
          imageUrl: randomQuestion.image_url,
          answerLabels: randomQuestion.answers.map((answer) => answer.label),
        },
      };
    }),

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
      const whereConditions = [
        eq(questions.qualification_id, input.qualificationId),
      ];

      if (input.year) {
        whereConditions.push(eq(questions.year, input.year));
      }

      const questionsData = await db.query.questions.findMany({
        where: and(...whereConditions),
        with: {
          answers: {
            orderBy: (answers, { asc }) => [asc(answers.label)],
          },
        },
        limit: input.limit,
        offset: input.offset,
        orderBy: (questions, { desc }) => [desc(questions.created_at)],
      });

      let filteredQuestions = questionsData;
      if (input.search && input.search.trim() !== "") {
        const searchLower = input.search.toLowerCase();
        filteredQuestions = questionsData.filter((q) =>
          q.content.toLowerCase().includes(searchLower),
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
          explanation: question.explanation,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: question.answers.map((answer) => answer.label),
          category: `Rok ${question.year}`,
          difficulty: "Średni",
        })),
        total: filteredQuestions.length,
      };
    }),

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

  //mutacja xpp
  generateExplanation: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        questionContent: z.string(),
        answers: z.array(z.string()),
        correctAnswerIndex: z.number(),
        answerLabels: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.auth?.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Musisz być zalogowany aby generować wyjaśnienia",
        });
      }

      const correctAnswer = input.answers[input.correctAnswerIndex];
      const correctLabel =
        input.answerLabels?.[input.correctAnswerIndex] ||
        String.fromCharCode(65 + input.correctAnswerIndex);

      const allAnswers = input.answers
        .map((answer, index) => {
          const label =
            input.answerLabels?.[index] || String.fromCharCode(65 + index);
          return `${label}. ${answer}`;
        })
        .join("\n");

      const systemPrompt = `Jesteś ekspertem edukacyjnym specjalizującym się w wyjaśnianiu pytań egzaminacyjnych. 

Twoim zadaniem jest wygenerowanie jasnego, zwięzłego wyjaśnienia dla podanego pytania egzaminacyjnego.

Wyjaśnienie powinno:
1. Wyjaśnić dlaczego poprawna odpowiedź jest poprawna
2. Krótko wyjaśnić dlaczego inne odpowiedzi są niepoprawne (jeśli to pomocne)
3. Podać dodatkowy kontekst lub informacje pomocne w zrozumieniu tematu
4. Być napisane w języku polskim
5. Być zwięzłe (maksymalnie 200 słów)

Nie witaj się z użytkownikiem, od razu przejdź do wyjaśnienia.`;

      const prompt = `Pytanie: ${input.questionContent}

Odpowiedzi:
${allAnswers}

Poprawna odpowiedź: ${correctLabel}. ${correctAnswer}

Wygeneruj wyjaśnienie dla tego pytania.`;

      try {
        const result = await generateText({
          model: groq("llama-3.3-70b-versatile"),
          system: systemPrompt,
          maxTokens: 400,
          prompt: prompt,
        });

        return {
          explanation: result.text,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Wystąpił błąd podczas generowania wyjaśnienia",
          cause: error,
        });
      }
    }),

  saveExplanation: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        explanation: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.auth?.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Musisz być zalogowany aby zapisywać wyjaśnienia",
        });
      }

      try {
        await db
          .update(questions)
          .set({
            explanation: input.explanation,
          })
          .where(eq(questions.id, input.questionId));

        return { success: true };
      } catch (error) {
        console.error("Błąd podczas zapisywania wyjaśnienia:", error);

        return { success: false };
      }
    }),
});
