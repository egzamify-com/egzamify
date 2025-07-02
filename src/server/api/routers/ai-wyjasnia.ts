import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { APP_CONFIG } from "~/APP_CONFIG";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  AiResponseWithFollowUpQuesionSchema,
  explanations,
} from "~/server/db/schema/ai-wyjasnia";
import { tryCatch } from "~/utils/tryCatch";

export const aiWyjasniaRouter = createTRPCRouter({
  requestAiExplanation: protectedProcedure
    .input(
      z.object({
        currentMode: z.string(),
        currentUserPrompt: z.string(),
        previousExplanationWithFollowUpQuestions: z
          .array(AiResponseWithFollowUpQuesionSchema)
          .optional(),
        explanationId: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        input: {
          currentMode,
          currentUserPrompt,
          previousExplanationWithFollowUpQuestions,
          // followUpQuestion,
          explanationId,
        },
        ctx: { auth },
      }) => {
        const user = auth?.user;
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Failed to get user requesting explanation",
          });
        }

        // check for user credits before ai interaction

        const [currentQualifications, qualificationListError] = await tryCatch(
          db.query.qualifications.findMany({
            columns: {
              name: true,
            },
          }),
        );
        if (qualificationListError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: qualificationListError.message,
          });
        }
        console.log(JSON.stringify(currentQualifications.map((x) => x.name)));

        const finalPrompt = `${currentUserPrompt}\n\n 
        MODE: ${currentMode}
        ${previousExplanationWithFollowUpQuestions && `PREVIOUS_EXPLANATION: ${previousExplanationWithFollowUpQuestions.map((x) => x.aiResponse).join("\n")}`}
        ${currentMode && `FOLLOW_UP_QUESTION: ${currentUserPrompt}`}  
        LIST OF QUALIFICATIONS (ALLOWED TOPICS): ${JSON.stringify(currentQualifications.map((x) => x.name))} 
        `;

        const [result, error] = await tryCatch(
          generateText({
            model: APP_CONFIG.ai_wyjasnia.model,
            system: APP_CONFIG.ai_wyjasnia.systemPrompt,
            maxTokens: APP_CONFIG.ai_wyjasnia.maxOutputTokens,
            prompt: finalPrompt,
          }),
        );

        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Wystąpił błąd podczas generowania wyjaśnienia",
          });
        }
        // if the prompt is follow up question, we just update current explanation
        // if the prompt is the initial one, we create new explanation
        if (previousExplanationWithFollowUpQuestions && explanationId) {
          const [dbResult, error] = await tryCatch(
            db
              .update(explanations)
              .set({
                aiResponsesWithQuestions: [
                  ...previousExplanationWithFollowUpQuestions,
                  {
                    aiResponse: result.text,
                    userPrompt: currentUserPrompt,
                    mode: currentMode,
                  },
                ],
              })
              .where(eq(explanations.id, explanationId))
              .returning(),
          );
          if (error || !dbResult[0]) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error?.message,
            });
          }
          return {
            response: result.text,
            explanationId: dbResult[0].id,
          };
        } else {
          const [dbResult, error] = await tryCatch(
            db
              .insert(explanations)
              .values({
                user_id: user.id,

                aiResponsesWithQuestions: [
                  {
                    userPrompt: currentUserPrompt,
                    mode: currentMode,
                    aiResponse: result.text,
                  },
                ],
              })
              .returning(),
          );
          if (error || !dbResult[0]) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error?.message,
            });
          }
          return {
            response: result.text,
            explanationId: dbResult[0].id,
          };
        }

        // success ai interaction -> put in db, charge credits, APP_CONFIG.ai_wyjasnia.creditPrice
      },
    ),

  getAiResponsesHistory: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.auth?.user;
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to get user requesting explanation",
      });
    }

    const [history, error] = await tryCatch(
      db
        .select()
        .from(explanations)
        .where(eq(explanations.user_id, user.id))
        .orderBy(desc(explanations.created_at)),
    );

    if (error || !history) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Wystąpił błąd podczas pobierania historii wyjaśnień",
        cause: error.message,
      });
    }

    return history;
  }),
});
