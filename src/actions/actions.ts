"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function getNextjsUser() {
  const user = await fetchQuery(
    api.users.query.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
