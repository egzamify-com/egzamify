import { authTables } from "@convex-dev/auth/server";
import { typedV } from "convex-helpers/validators";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const requirementsValidator = v.array(
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
    .index("requesting_user_id", ["requestingUserId"])
    .index("receiving_user_id", ["receivingUserId"]),

  // ----------------TEORIA TABLES----------------------
  users_theory: defineTable({
    name: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"]),

  qualifications: defineTable({
    name: v.string(),
    label: v.string(),
    created_at: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_label", ["label"]),

  questions: defineTable({
    qualification_id: v.id("qualifications"),
    content: v.string(),
    year: v.number(),
    image_url: v.optional(v.string()),
    explanation: v.optional(v.string()),
    created_at: v.optional(v.number()),
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

  basePracticalExams: defineTable({
    qualificationId: v.id("qualifications"),
    code: v.string(),
    maxPoints: v.number(),
    examInstructions: v.string(),
    examDate: v.string(),
    examAttachments: v.array(
      v.object({
        attachmentName: v.string(),
        attachmentId: v.id("_storage"),
      }),
    ),
    ratingData: requirementsValidator,
  }).index("qualificationId", ["qualificationId"]),

  usersPracticalExams: defineTable({
    userId: v.id("users"),
    examId: v.id("basePracticalExams"),
    attachments: v.array(v.string()),
    status: v.union(
      v.literal("user_pending"),
      v.literal("ai_pending"),
      v.literal("done"),
    ),
    aiRating: v.object({
      score: v.number(),
      percantageScore: v.number(),
      summary: v.string(),
      details: requirementsValidator,
    }),
  }),
});

export const vv = typedV(schema);
export default schema;
