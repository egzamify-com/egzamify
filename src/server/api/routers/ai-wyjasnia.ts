import { groq } from "@ai-sdk/groq";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  AiResponseWithFollowUpQuesionSchma,
  explanations,
} from "~/server/db/schema/ai-wyjasnia";
import { tryCatch } from "~/utils/tryCatch";

export const aiWyjasniaRouter = createTRPCRouter({
  requestAiExplanation: protectedProcedure
    .input(
      z.object({
        mode: z.string(),
        userPrompt: z.string(),
        reroll: z.boolean(),
        previousExplanationWithFollowUpQuestions: z
          .array(AiResponseWithFollowUpQuesionSchma)
          .optional(),
        followUpQuestion: z.string().optional(),
        explanationId: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        input: {
          mode,
          reroll,
          userPrompt,
          previousExplanationWithFollowUpQuestions,
          followUpQuestion,
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

        const systemPrompt = `You are an AI-powered educational assistant specialized in explaining complex terms and concepts. Your primary goal is to provide clear, concise, and accurate explanations tailored to the user's requested mode.

Dont welcome user, eg. welcome, hi, hello, hey, greetings, how are you, what's up, what's going on, etc.

When a user provides a term and a mode, generate a comprehensive explanation.

Always ensure the explanation is easy to understand for the target audience of the chosen mode. Avoid jargon where possible, or explain it immediately if necessary. Maintain a helpful, patient, and informative tone.

If you are unsure about a term or if it falls outside common knowledge, state that you don't have enough information to provide a clear explanation for that specific query.

If a PREVIOUS_EXPLANATION is provided, understand the new prompt in that context and update/refine the explanation based on the new query, rather than starting fresh.

If a FOLLOW_UP_QUESTION is provided, you have to ignore the user prompt and generate a follow-up explanation based on the context of previous explanation and the user follow up question, new answer has to answer the question. Provide only answer to the question.

Your answer has to be in polish language.

Your answer has to be under 300 tokens, so around 150 words.

MODE will tell you what kind of explanation you need to provide. It will be one of the following:

### Mode: normal explnanation ### 
Your task is to explain the term in a clear, standard, and academically sound manner suitable for a general audience with some basic technical understanding. Provide a definition, explain its function or purpose, and give a concise example if applicable.

### Mode: detailed explanation ###
Your task is to provide a comprehensive and in-depth explanation of the term. Include technical specifics, underlying principles, variations, common applications, potential challenges or criticisms, and historical context if relevant. Assume the user has a strong interest and some foundational knowledge.

### Mode: ELI5  ###
Your task is to explain the term as if you are talking to a five-year-old child. Use very simple words, short sentences, and relatable analogies from everyday life (like toys, games, animals, or food). Focus on the core idea, not technical details. Make it fun and easy to grasp.

MODE: ${mode}
${previousExplanationWithFollowUpQuestions && `PREVIOUS_EXPLANATION: ${previousExplanationWithFollowUpQuestions.map((x) => x.aiResponse).join("\n")}`}
${followUpQuestion && `FOLLOW_UP_QUESTION: ${followUpQuestion}`}

`;

        const [result, error] = await tryCatch(
          generateText({
            model: groq("llama-3.3-70b-versatile"),
            system: systemPrompt,
            maxTokens: 500,
            prompt: followUpQuestion ? "" : userPrompt,
          }),
        );

        if (error || !result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Wystąpił błąd podczas generowania wyjaśnienia",
          });
        }
        console.log("current chat history ----------->");
        if (previousExplanationWithFollowUpQuestions) {
          previousExplanationWithFollowUpQuestions.map((x) => {
            console.log(`reponse: ${x.aiResponse}`);
            console.log(`follow up question: ${x.followUpQuestion}`);
          });
        }
        if (previousExplanationWithFollowUpQuestions && explanationId) {
          console.log(`user qusetion : ${userPrompt}`);
          console.log(`answer to follorUP : ${result.text}`);
          console.log("SHOULD UPDATE EXISTING ENTRY HERRE WITH NEW FOLLOWUPS");
          const [dbResult, error] = await tryCatch(
            db
              .update(explanations)
              .set({
                aiResponsesWithQuestions:
                  previousExplanationWithFollowUpQuestions,
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
            reponse: result.text,
            explanationId: dbResult[0].id,
          };
        } else {
          console.log("SHOULD CREATE NEW ENTRY HERRE");
          console.log(`user prompt: ${userPrompt}`);
          console.log(`ai response: ${result.text}`);
          const [dbResult, error] = await tryCatch(
            db
              .insert(explanations)
              .values({ user_id: user.id, userPrompt: userPrompt, mode: mode })
              .returning(),
          );
          if (error || !dbResult[0]) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error?.message,
            });
          }
          return {
            reponse: result.text,
            explanationId: dbResult[0].id,
          };
        }

        // success ai interaction -> put in db, charge credits
      },
    ),
});
