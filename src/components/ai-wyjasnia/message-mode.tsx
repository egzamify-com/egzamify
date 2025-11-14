import { Copy } from "lucide-react"
import { toast } from "sonner"
import type { MyUIMessage } from "~/app/api/chat/route"
import { convertDateToEpoch } from "~/lib/dateUtils"
import { cn } from "~/lib/utils"
import SemanticDate from "../semantic-date"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export default function MessageModeAndActionBtns({
  message,
}: {
  message: MyUIMessage
}) {
  return (
    <div
      className={cn(
        `absolute -top-10 flex w-full flex-row items-center justify-start gap-2 overflow-visible px-2`,
        message.role === "user" ? "right-10" : "left-10",
      )}
    >
      {message.role === "assistant" && (
        <Badge variant="outline">{message.metadata?.mode}</Badge>
      )}
      <div
        className={cn(
          `flex w-full flex-row gap-2`,
          message.role === "user" ? "flex-row-reverse" : "flex-row",
        )}
      >
        <CopyButton {...{ message }} />
        {message.metadata?.createdAt && (
          <SemanticDate
            size="text-sm"
            withIcon
            date={convertDateToEpoch(new Date(message.metadata.createdAt))}
          />
        )}
      </div>
    </div>
  )
}

function CopyButton({ message }: { message: MyUIMessage }) {
  // we grab "1" part becasue first '0' part is a 'step-start' indicator,
  // actual llms response is in second object
  //
  function handleCopy() {
    const textToCopy =
      message.parts[1]?.type === "text" ? message.parts[1].text : ""

    navigator.clipboard.writeText(textToCopy)
    toast.message("Skopiowano do schowka")
  }
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-muted-foreground"
            onClick={handleCopy}
          >
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Kopiuj</TooltipContent>
      </Tooltip>
    </>
  )
}
