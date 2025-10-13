"use server"

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { fetchAction } from "convex/nextjs"
import { chargeCredits, refundCredits } from "../actions"

const EXPLANATION_COST = 0.25

interface GenerateExplanationArgs {
  questionId: string
  questionContent: string
  answers: string[]
  correctAnswerIndex: number
  answerLabels?: string[]
}

export async function generateExplanationWithCharge(
  args: GenerateExplanationArgs,
): Promise<{ explanation: string; success: boolean; error?: string }> {
  console.log(
    "Rozpoczynam generowanie NOWEGO wyjaśnienia z pobraniem kredytów...",
  )

  const gotCharged = await chargeCredits(EXPLANATION_COST)
  if (!gotCharged) {
    console.log("Brak wystarczających kredytów")
    return {
      explanation: "",
      success: false,
      error:
        "Nie masz wystarczającej liczby kredytów. Potrzebujesz 0.25 kredyta.",
    }
  }

  try {
    console.log("Generuję wyjaśnienie z Groq...")

    const result = await fetchAction(
      api.teoria.actions.generateExplanation,
      {
        questionId: args.questionId as Id<"questions">,
        questionContent: args.questionContent,
        answers: args.answers,
        correctAnswerIndex: args.correctAnswerIndex,
        answerLabels: args.answerLabels,
      },
      {
        token: await convexAuthNextjsToken(),
      },
    )

    console.log("Wyjaśnienie wygenerowane pomyślnie!")
    return {
      explanation: result.explanation,
      success: true,
    }
  } catch (error) {
    console.error("Błąd podczas generowania wyjaśnienia:", error)
    console.log("Zwracam kredyty użytkownikowi...")

    await refundCredits(EXPLANATION_COST)

    return {
      explanation: "",
      success: false,
      error:
        "Wystąpił błąd podczas generowania wyjaśnienia. Twoje kredyty zostały zwrócone.",
    }
  }
}

export async function showExplanationWithCharge(
  explanation: string,
): Promise<{ success: boolean; error?: string }> {
  console.log("Pobieranie 0.25 kredyta za pokazanie wyjaśnienia...")

  const gotCharged = await chargeCredits(EXPLANATION_COST)
  if (!gotCharged) {
    console.log("Brak wystarczających kredytów")
    return {
      success: false,
      error:
        "Nie masz wystarczającej liczby kredytów. Potrzebujesz 0.25 kredyta.",
    }
  }

  console.log("Kredyty pobrane, pokazuję wyjaśnienie")
  return {
    success: true,
  }
}
