import { v } from "convex/values";

export const requirementsValidator = v.array(
  v.object({
    title: v.string(),
    note: v.optional(v.string()),
    symbol: v.string(),
    requirements: v.array(
      v.object({
        symbol: v.string(),
        description: v.string(),
        answer: v.optional(
          v.object({
            isCorrect: v.boolean(),
            explanation: v.string(),
          }),
        ),
      }),
    ),
  }),
);
