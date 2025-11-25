import { authTables } from "@convex-dev/auth/server"
import { typedV } from "convex-helpers/validators"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
  practicalExamAttachmentValidator,
  requirementsValidator,
} from "./praktyka/helpers"

export const pvpQuizPlayerDataValidator = v.optional(
  v.object({
    answersIds: v.optional(v.array(v.id("userAnswers"))),
    status: v.optional(
      v.union(v.literal("waiting"), v.literal("answering"), v.literal("done")),
    ),
    time: v.optional(v.number()),
    score: v.optional(v.number()),
    submittedAt: v.optional(v.number()),
    startedAt: v.optional(v.number()),
  }),
)

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    githubId: v.optional(v.number()),
    githubAccessToken: v.optional(v.string()),
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    credits: v.optional(v.number()),
    pendingCredits: v.optional(v.number()),
    daily_streak: v.optional(v.number()),
    onBoarded: v.optional(v.boolean()),

    savedQualificationsIds: v.optional(v.array(v.id("qualifications"))),
  })
    .index("username", ["username"])
    .index("email", ["email"])
    .searchIndex("search_username", {
      searchField: "username",
      filterFields: ["username", "name"],
    }),
  explanations: defineTable({
    userId: v.id("users"),
    content: v.string(),
  }).index("by_user", ["userId"]),

  friends: defineTable({
    requestingUserId: v.id("users"),
    receivingUserId: v.id("users"),
    status: v.union(v.literal("request_sent"), v.literal("accepted")),
    updatedAt: v.number(),
  })
    .index("from_to", ["requestingUserId", "receivingUserId"])
    .index("requestingUserId", ["requestingUserId"])
    .index("receivingUserId", ["receivingUserId"]),

  users_theory: defineTable({
    name: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"]),

  qualifications: defineTable({
    name: v.string(),
    label: v.string(),
    nameLabelCombined: v.optional(v.string()),
    created_at: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_label", ["label"])
    .searchIndex("combined_search", {
      searchField: "nameLabelCombined",
      filterFields: ["label", "name", "nameLabelCombined"],
    }),

  questions: defineTable({
    qualificationId: v.id("qualifications"),
    content: v.string(),
    year: v.number(),
    month: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    explanation: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
  })
    .index("by_qualification", ["qualificationId"])
    .index("by_year", ["year"])
    .index("by_qualification_year", ["qualificationId", "year"]),

  answers: defineTable({
    questionId: v.id("questions"),
    content: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    isCorrect: v.boolean(),
    label: v.string(),
  }).index("by_question", ["questionId"]),

  userAnswers: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    isCorrect: v.boolean(),
    answerId: v.id("answers"),
  })
    .index("by_question", ["questionId"])
    .index("by_userId", ["userId"]),

  userActivityHistory: defineTable({
    user_id: v.id("users"),
    start_date: v.number(),
    stop_date: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_date", ["user_id", "start_date"]),

  basePracticalExams: defineTable({
    qualificationId: v.id("qualifications"),
    code: v.string(),
    maxPoints: v.number(),
    examInstructions: v.string(),
    examDate: v.string(),
    examAttachments: practicalExamAttachmentValidator,
    ratingData: requirementsValidator,
  })
    .index("qualificationId", ["qualificationId"])
    .index("examCode", ["code"]),

  usersPracticalExams: defineTable({
    userId: v.id("users"),
    examId: v.id("basePracticalExams"),
    attachments: v.optional(practicalExamAttachmentValidator),
    submittedAt: v.optional(v.number()),
    wasSeenByUser: v.optional(v.boolean()),
    status: v.union(
      v.literal("user_pending"),
      v.literal("parsing_exam"),
      v.literal("ai_pending"),
      v.literal("done"),
      v.literal("not_enough_credits_error"),
      v.literal("unknown_error_credits_refunded"),
    ),
    aiRating: v.optional(
      v.object({
        score: v.number(),

        summary: v.string(),
        details: v.optional(requirementsValidator),
      }),
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_userId_examId", ["userId", "examId"]),

  kv: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  feedbackTable: defineTable({
    userId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("Błąd"),
      v.literal("Propozycja funkcji"),
      v.literal("Opinia"),
    ),
  }).index("by_user_id", ["userId"]),

  pvpQuizzes: defineTable({
    creatorUserId: v.id("users"),
    opponentUserId: v.id("users"),
    status: v.union(
      v.literal("waiting_for_oponent_accept"),
      v.literal("opponent_declined"),
      v.literal("quiz_pending"),
      v.literal("quiz_completed"),
    ),
    startedAt: v.optional(v.number()),
    winnerUserId: v.optional(v.id("users")),
    winnerType: v.optional(
      v.union(v.literal("by_score"), v.literal("by_time")),
    ),
    creatorData: pvpQuizPlayerDataValidator,
    opponentData: pvpQuizPlayerDataValidator,
    quizQuestionsIds: v.array(v.id("questions")),
    quizQualificationId: v.id("qualifications"),
  }).index("by_status", ["status"]),
})

export default schema

export const vv = typedV(schema)
