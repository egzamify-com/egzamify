import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  explanations: defineTable({
    user_id: v.id("users"),
    content: v.string(),
  }).index("by_user", ["user_id"]),
});

export default schema;
