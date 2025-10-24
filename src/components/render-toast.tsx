"use client"

import type { ReactNode } from "react"
import { toast } from "sonner"

export default function RenderToast({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  toast.success(title, {
    description,
    action: action,
  })
  return null
}
