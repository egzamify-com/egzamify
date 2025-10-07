import { LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function DashboardBtn() {
  return (
    <Link href={"/dashboard"}>
      <Button size="lg" variant="default" className="min-w-[160px] text-base">
        <LayoutDashboard />
        Dashboard
      </Button>
    </Link>
  )
}
