import { LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button, type ButtonProps } from "../ui/button"

export default function DashboardBtn({ ...props }: ButtonProps) {
  return (
    <Link href={"/dashboard"}>
      <Button {...props} variant="default" className="w-40">
        <LayoutDashboard />
        Dashboard
      </Button>
    </Link>
  )
}
