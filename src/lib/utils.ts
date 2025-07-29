import { clsx, type ClassValue } from "clsx";
import type { Id } from "convex/_generated/dataModel";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getFileFromId(storageId: Id<"_storage">, filename: string) {
  // USE ACTUAL URL FROM ENV HERE
  const getImageUrl = new URL(
    `https://precise-bobcat-903.convex.site/getImage`,
  );
  getImageUrl.searchParams.set("storageId", storageId);
  getImageUrl.searchParams.set("filename", filename);
  console.log("URL - ", getImageUrl.href);
  return getImageUrl.href;
}
