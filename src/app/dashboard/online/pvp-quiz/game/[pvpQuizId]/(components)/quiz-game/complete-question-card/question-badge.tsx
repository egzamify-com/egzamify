import type { VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"
import { Badge, type badgeVariants } from "~/components/ui/badge"

export default function QuestionBadge({
  children,
  variant = "outline",
}: {
  children: ReactNode
  variant?: VariantProps<typeof badgeVariants>["variant"]
}) {
  return (
    <Badge
      variant={variant}
      className="flex flex-row items-center justify-center gap-2 rounded-xl px-3 py-1"
    >
      {children}
    </Badge>
  )
}
