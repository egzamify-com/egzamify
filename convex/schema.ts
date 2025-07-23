import { authTables } from "@convex-dev/auth/server";
import { typedV } from "convex-helpers/validators";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    user_id: v.id("users"),
    content: v.string(),
  }).index("by_user", ["user_id"]),

  friends: defineTable({
    requesting_user_id: v.id("users"),
    receiving_user_id: v.id("users"),
    status: v.union(v.literal("request_sent"), v.literal("accepted")),
    updated_at: v.number(),
  })
    .index("from_to", ["requesting_user_id", "receiving_user_id"])
    .index("requesting_user_id", ["requesting_user_id"])
    .index("receiving_user_id", ["receiving_user_id"]),
});

export const vv = typedV(schema);

export default schema;
