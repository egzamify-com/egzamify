"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

export async function getFileUrl(
  storageId: Id<"_storage"> | undefined,
  filename: string,
  type?: { raw: boolean },
) {
  if (!storageId) return null;
  // USE ACTUAL URL FROM ENV HERE
  let imageUrl;
  if (type?.raw) {
    imageUrl = new URL(`https://precise-bobcat-903.convex.site/getRawImage`);
  } else {
    imageUrl = new URL(`https://precise-bobcat-903.convex.site/getImage`);
  }
  imageUrl.searchParams.set("storageId", storageId);
  imageUrl.searchParams.set("filename", filename);
  // console.log("URL - ", imageUrl.href);
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
