import { Gem } from "lucide-react"
import Link from "next/link"
import { Button, type ButtonProps } from "../ui/button"

export default function GetCreditsBtn({ ...props }: ButtonProps) {
  return (
    <Link href={"/pricing"} prefetch={true}>
      <Button variant={"outline"} {...props}>
        <Gem size={20} />
        {"Doładuj konto"}
      </Button>
    </Link>
  )
}
