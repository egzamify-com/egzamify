import { Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function GetCreditsBtn() {
  return (
    <Link href={"/pricing"}>
      <Button variant={"outline"} size={"lg"}>
        <Wallet />
        Zdobądź kredyty
      </Button>
    </Link>
  )
}
