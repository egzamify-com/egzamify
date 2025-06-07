import { groq } from "@ai-sdk/groq";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export const aiWyjasniaRouter = createTRPCRouter({
  requestAiExplanation: protectedProcedure
    .input(
      z.object({
        mode: z.string(),
        userPrompt: z.string(),
        reroll: z.boolean(),
        previousExplanation: z.string().optional(),
        followUpQuestion: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        input: {
          mode,
          reroll,
          userPrompt,
          previousExplanation,
          followUpQuestion,
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
        const systemPrompt = `You are an AI-powered educational assistant specialized in explaining complex terms and concepts. Your primary goal is to provide clear, concise, and accurate explanations tailored to the user's requested mode.

When a user provides a term and a mode, generate a comprehensive explanation.

Always ensure the explanation is easy to understand for the target audience of the chosen mode. Avoid jargon where possible, or explain it immediately if necessary. Maintain a helpful, patient, and informative tone.

If you are unsure about a term or if it falls outside common knowledge, state that you don't have enough information to provide a clear explanation for that specific query.

If a PREVIOUS_EXPLANATION is provided, understand the new prompt in that context and update/refine the explanation based on the new query, rather than starting fresh.

If a FOLLOW_UP_QUESTION is provided, generate a follow-up explanation based on the context of previous explanation and the user follow up question, new answer has to answer the question. Provide only answer to the question.

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
${previousExplanation && `PREVIOUS_EXPLANATION: ${previousExplanation}`}
${followUpQuestion && `FOLLOW_UP_QUESTION: ${followUpQuestion}`}

`;

        const result = await generateText({
          model: groq("llama-3.3-70b-versatile"),
          system: systemPrompt,
          maxTokens: 500,
          prompt: userPrompt,
        });

        // const regex = /<think>(.*?)<\/think>/s;

        // const cleaned = result.text.replace(regex, "");

        console.log(result);
        console.log("llm : ", result.text);
        return {
          reponse: result.text,
        };
      },
    ),
});
