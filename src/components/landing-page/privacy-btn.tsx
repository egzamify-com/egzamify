import Link from "next/link"
import { Button } from "../ui/button"
export default function PrivacyBtn() {
  return (
    <Button variant="default" className="min-w-[160px]">
      <Link href="/polityka-prywatnosci" className="group">
        Polityka Prywatności
      </Link>
    </Button>
  )
}
