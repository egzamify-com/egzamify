import { LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function DashboardBtn() {
  return (
    <Link href={"/dashboard"}>
      <Button variant="default">
        <LayoutDashboard />
        Dashboard
      </Button>
    </Link>
  )
}
