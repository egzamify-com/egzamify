import { defineTable } from "convex/server";
import { v } from "convex/values";

export const explanations = defineTable({
  user_id: v.id("users"),
  content: v.string(),
}).index("by_user", ["user_id"]);
