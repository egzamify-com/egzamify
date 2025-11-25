import Link from "next/link"
import CreditIcon from "../credit-icon"
import { Button, type ButtonProps } from "../ui/button"

export default function GetCreditsBtn({ ...props }: ButtonProps) {
  return (
    <Link href={"/pricing"} prefetch={true}>
      <Button variant={"outline"} className="w-40" {...props}>
        <CreditIcon className="h-5 w-5" />
        {"Doładuj konto"}
      </Button>
    </Link>
  )
}
