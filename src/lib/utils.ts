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
) {
  if (!storageId) return undefined;
  const raw = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getRawImage`);
  raw.searchParams.set("storageId", storageId);
  raw.searchParams.set("filename", filename);
  const normal = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`);
  normal.searchParams.set("storageId", storageId);
  normal.searchParams.set("filename", filename);
  return { raw, normal };
}
