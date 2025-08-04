"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { env } from "~/env";

export async function getFileUrl(
  storageId: Id<"_storage"> | undefined,
  filename: string,
  type?: { raw: boolean },
) {
  if (!storageId) return null;
  let imageUrl;
  if (type?.raw) {
    imageUrl = new URL(`${env.CONVEX_SITE_URL}/getRawImage`);
  } else {
    imageUrl = new URL(`${env.CONVEX_SITE_URL}/getImage`);
  }
  imageUrl.searchParams.set("storageId", storageId);
  imageUrl.searchParams.set("filename", filename);
  return imageUrl.href;
}

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
