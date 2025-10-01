import { Bug } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export default function Feedbackbtn() {
  return (
    <Link href={"/feedback"}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <Bug />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Report a bug or send feedback</TooltipContent>
      </Tooltip>
    </Link>
  )
}
