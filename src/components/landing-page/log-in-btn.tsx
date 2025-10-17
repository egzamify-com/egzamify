import type { VariantProps } from "class-variance-authority"
import { LogIn } from "lucide-react"
import Link from "next/link"
import { cn } from "~/lib/utils"
import { Button, type buttonVariants } from "../ui/button"

export default function LogInBtn({
  className,
  size,
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  return (
    <Link href={"/sign-in"}>
      <Button
        size={size}
        variant="default"
        className={cn("min-w-[160px] text-base", className)}
      >
        <LogIn />
        Rozpocznij
      </Button>
    </Link>
  )
}
