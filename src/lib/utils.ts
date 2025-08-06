import { clsx, type ClassValue } from "clsx";
import type { Id } from "convex/_generated/dataModel";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileUrl(
  storageId: Id<"_storage"> | undefined,
  filename: string,
  type?: { raw: boolean },
) {
  if (!storageId) return undefined;
  let imageUrl;
  if (type?.raw) {
    imageUrl = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getRawImage`);
  } else {
    imageUrl = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`);
  }
  imageUrl.searchParams.set("storageId", storageId);
  imageUrl.searchParams.set("filename", filename);
  return imageUrl.href;
}
