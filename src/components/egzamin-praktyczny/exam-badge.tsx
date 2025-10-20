import type { ReactNode } from "react"
import { Badge } from "../ui/badge"

export default function ExamBadge({
  stat,
  icon,
}: {
  stat: ReactNode
  icon?: ReactNode
}) {
  return (
    <Badge variant={"secondary"} className="p-2">
      <div className="flex flex-row items-center justify-center gap-2 text-xs">
        {icon}
        <p>{stat}</p>
      </div>
    </Badge>
  )
}
