import Link from "next/link"
import { ModeToggle } from "./theme/theme-toggle"
import { Badge } from "./ui/badge"

export default function MinimalNavbar() {
  return (
    <div className="absolute flex w-full flex-row items-center justify-between px-3 py-2">
      <Link href={"/"}>
        <div className="relative flex flex-row items-start justify-start gap-2">
          <h1 className="logo-font">Egzamify</h1>
          <Badge
            variant={"outline"}
            className="absolute top-2 right-[-55px] rounded-xl"
          >
            <p className="">Beta</p>
          </Badge>
        </div>
      </Link>
      <ModeToggle />
    </div>
  )
}
