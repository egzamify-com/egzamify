import { groq } from "@ai-sdk/groq";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateText } from "ai";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveExplanation = mutation({
  args: {
    questionId: v.id("questions"),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const { questionId, explanation } = args;

    try {
      await ctx.db.patch(questionId, {
        explanation,
      });

      return { success: true };
    } catch (error) {
      console.error("Błąd podczas zapisywania wyjaśnienia:", error);
      return { success: false };
    }
  },
});

export const generateExplanation = mutation({
  args: {
    questionId: v.id("questions"),
    questionContent: v.string(),
    answers: v.array(v.string()),
    correctAnswerIndex: v.number(),
    answerLabels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log(" MUTATION generateExplanation WYWOŁANA!");

    const userId = await getAuthUserId(ctx);
    if (!userId)
      throw new Error("Musisz być zalogowany aby generować wyjaśnienia");

    const {
      questionId,
      questionContent,
      answers,
      correctAnswerIndex,
      answerLabels,
    } = args;

    console.log(" Dane wejściowe:");
    console.log("- Pytanie:", questionContent);
    console.log("- Odpowiedzi:", answers);
    console.log("- Poprawna odpowiedź:", answers[correctAnswerIndex]);

    const correctAnswer = answers[correctAnswerIndex];
    const correctLabel =
      answerLabels?.[correctAnswerIndex] ||
      String.fromCharCode(65 + correctAnswerIndex);

    const allAnswers = answers
      .map((answer, index) => {
        const label = answerLabels?.[index] || String.fromCharCode(65 + index);
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

    const prompt = `Pytanie: ${questionContent}

Odpowiedzi:
${allAnswers}

Poprawna odpowiedź: ${correctLabel}. ${correctAnswer}

Wygeneruj wyjaśnienie dla tego pytania.`;

    try {
      const result = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        maxOutputTokens: 400,
        prompt: prompt,
      });

      console.log("Otrzymano odpowiedź z Groq:", result.text);

      try {
        await ctx.db.patch(questionId, {
          explanation: result.text,
        });
        console.log("Wyjaśnienie zapisane do bazy danych");
      } catch (error) {
        console.error("Błąd podczas zapisywania wyjaśnienia:", error);
      }

      return {
        explanation: result.text,
      };
    } catch (error) {
      console.error("Błąd podczas generowania wyjaśnienia z Groq:", error);
      throw new Error("Wystąpił błąd podczas generowania wyjaśnienia");
    }
  },
});
