import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { explanations } from "./ai_wyjasnia/schema";

const schema = defineSchema({
  ...authTables,

  explanations: explanations,
});

export default schema;
