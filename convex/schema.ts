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
    .index("requestingUserId", ["requestingUserId"])
    .index("receivingUserId", ["receivingUserId"]),

  base_practical_exams: defineTable({
    qualificationId: v.id("qualifications"),
    maxPoints: v.number(),
    examPdf: v.id("_storage"),
    examInstructions: v.string(),
    examDate: v.string(),
    examAttachments: v.array(v.id("_storage")),
    ratingPdf: v.id("_storage"),
    ratingData: requirementsValidator,
  }).index("qualificationId", ["qualificationId"]),

  users_practical_exams: defineTable({
    userId: v.id("users"),
    examId: v.id("base_practical_exams"),
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
