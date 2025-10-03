import Link from "next/link"
import { Button } from "../ui/button"

export default function LogInBtn() {
  return (
    <Link href={"/sign-in"}>
      <Button size="lg" variant="default" className="min-w-[160px] text-base">
        Zaloguj się
      </Button>
    </Link>
  )
}
