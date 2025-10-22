import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
  practicalExamAttachmentValidator,
  requirementsValidator,
} from "./praktyka/helpers"

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

    preferredQualificationsIds: v.optional(v.array(v.id("qualifications"))),
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
    qualification_id: v.id("qualifications"),
    content: v.string(),
    year: v.number(),
    image_url: v.optional(v.string()),
    explanation: v.optional(v.string()),
    created_at: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
  })
    .index("by_qualification", ["qualification_id"])
    .index("by_year", ["year"])
    .index("by_qualification_year", ["qualification_id", "year"]),

  answers: defineTable({
    question_id: v.id("questions"),
    content: v.string(),
    image_url: v.optional(v.string()),
    is_correct: v.boolean(),
    label: v.string(),
  }).index("by_question", ["question_id"]),

  userAnswers: defineTable({
    user_id: v.id("users"),
    question_id: v.id("questions"),
    isCorrect: v.boolean(),
    answer_id: v.id("answers"),
    answered_at: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_user_date", ["user_id", "answered_at"])
    .index("by_question", ["question_id"]),

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
  }).index("qualificationId", ["qualificationId"]),

  usersPracticalExams: defineTable({
    userId: v.id("users"),
    examId: v.id("basePracticalExams"),
    attachments: v.optional(practicalExamAttachmentValidator),
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
})

export default schema
