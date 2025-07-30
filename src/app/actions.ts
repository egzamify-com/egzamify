"use server";

import type { Id } from "convex/_generated/dataModel";

export async function getFileUrl(
  storageId: Id<"_storage"> | undefined,
  filename: string,
) {
  if (!storageId) return null;
  // USE ACTUAL URL FROM ENV HERE
  const getImageUrl = new URL(
    `https://precise-bobcat-903.convex.site/getImage`,
  );
  getImageUrl.searchParams.set("storageId", storageId);
  getImageUrl.searchParams.set("filename", filename);
  // console.log("URL - ", getImageUrl.href);
  return getImageUrl.href;
}
