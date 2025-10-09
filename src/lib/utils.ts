import { clsx, type ClassValue } from "clsx"
import type { Id } from "convex/_generated/dataModel"
import { ConvexError } from "convex/values"
import { twMerge } from "tailwind-merge"
import { env } from "~/env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(
  storageId: Id<"_storage"> | undefined,
  filename: string,
) {
  if (!storageId) return undefined
  const raw = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getRawImage`)
  raw.searchParams.set("storageId", storageId)
  raw.searchParams.set("filename", filename)
  const normal = new URL(`${env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`)
  normal.searchParams.set("storageId", storageId)
  normal.searchParams.set("filename", filename)
  return { raw, normal }
}
export function parseConvexError(error: unknown) {
  const errMess =
    error instanceof ConvexError
      ? (error.data as string)
      : `[ERROR] Unexpected error occurred - ${error}`
  return errMess
}
export function parseConvexObjectError(error: unknown) {
  const errMess =
    error instanceof ConvexError
      ? (error.data as { message: string }).message
      : `[ERROR] Unexpected error occurred - ${error}`
  return errMess
}
