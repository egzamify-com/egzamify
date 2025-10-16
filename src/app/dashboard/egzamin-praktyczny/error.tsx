"use client"

import FullScreenError from "~/components/full-screen-error"
import { parseConvexError } from "~/lib/utils"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <FullScreenError
      errorMessage="Wystąpił problem z pobraniem egzaminów"
      errorDetail={parseConvexError(error)}
    />
  )
}
