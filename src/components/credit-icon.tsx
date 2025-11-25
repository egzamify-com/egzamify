"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/lib/utils"

export default function CreditIcon({
  className = "h-8 w-8",
  flipTheme = false,
}: {
  className?: ComponentPropsWithoutRef<"image">["className"]
  flipTheme?: boolean
}) {
  const { theme } = useTheme()

  const srcToUse =
    flipTheme === false
      ? theme === "light"
        ? "/favicon.ico"
        : "/icon.png"
      : theme !== "light"
        ? "/favicon.ico"
        : "/icon.png"

  return (
    <Image
      className={cn(className)}
      width={30}
      height={30}
      alt="Ikona kredytów egzamify"
      src={srcToUse}
    />
  )
}
