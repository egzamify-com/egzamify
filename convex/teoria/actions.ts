"use node"

import { groq } from "@ai-sdk/groq"
import { getAuthUserId } from "@convex-dev/auth/server"
import { generateText } from "ai"
import { v } from "convex/values"
import { api } from "../_generated/api"
import { action } from "../_generated/server"

export const generateExplanation = action({
  args: {
    questionId: v.id("questions"),
    questionContent: v.string(),
    answers: v.array(v.string()),
    correctAnswerIndex: v.number(),
    answerLabels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId)
      throw new Error("Musisz być zalogowany aby generować wyjaśnienia")

    const {
      questionId,
      questionContent,
      answers,
      correctAnswerIndex,
      answerLabels,
    } = args

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      throw new Error(
        "GROQ_API_KEY nie jest ustawiony w zmiennych środowiskowych Convex",
      )
    }

    const correctAnswer = answers[correctAnswerIndex]
    const correctLabel =
      answerLabels?.[correctAnswerIndex] ||
      String.fromCharCode(65 + correctAnswerIndex)

    const allAnswers = answers
      .map((answer, index) => {
        const label = answerLabels?.[index] || String.fromCharCode(65 + index)
        return `${label}. ${answer}`
      })
      .join("\n")

    const systemPrompt = `Jesteś ekspertem edukacyjnym specjalizującym się w wyjaśnianiu pytań egzaminacyjnych.

Twoim zadaniem jest wygenerowanie jasnego, zwięzłego wyjaśnienia dla podanego pytania egzaminacyjnego.

Wyjaśnienie powinno:
1. Wyjaśnić dlaczego poprawna odpowiedź jest poprawna
2. Krótko wyjaśnić dlaczego inne odpowiedzi są niepoprawne (jeśli to pomocne)
3. Podać dodatkowy kontekst lub informacje pomocne w zrozumieniu tematu
4. Być napisane w języku polskim
5. Być krótkie i zwięzłe

Nie witaj się z użytkownikiem, od razu przejdź do wyjaśnienia.`

    const prompt = `Pytanie: ${questionContent}

Odpowiedzi:
${allAnswers}

Poprawna odpowiedź: ${correctLabel}. ${correctAnswer}

Wygeneruj wyjaśnienie dla tego pytania.`

    try {
      const result = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        maxOutputTokens: 400,
        prompt: prompt,
      })

      try {
        await ctx.runMutation(api.teoria.mutate.saveExplanation, {
          questionId,
          explanation: result.text,
        })
      } catch (error) {
        console.error("Błąd podczas zapisywania wyjaśnienia:", error)
      }

      return {
        explanation: result.text,
      }
    } catch (error) {
      console.error(" Błąd podczas generowania wyjaśnienia z Groq:", error)
      throw new Error("Wystąpił błąd podczas generowania wyjaśnienia")
    }
  },
})
