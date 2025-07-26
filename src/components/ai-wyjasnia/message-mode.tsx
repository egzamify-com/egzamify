import type { Message } from "ai";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { convertDateToEpoch } from "~/utils/dateUtils";
import SemanticDate from "../semantic-date";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function MessageMode({ message }: { message: Message }) {
  return (
    <div className="absolute top-[-38px] left-[0px] flex w-full flex-row justify-between px-2">
      <div>
        {message.role === "assistant" &&
          parseAnnotations(message.annotations) && (
            <Badge variant="outline">
              {parseAnnotations(message.annotations)}
            </Badge>
          )}
      </div>
      <div className={`flex flex-row gap-2`}>
        <CopyButton {...{ message }} />
        {message.createdAt && (
          <SemanticDate
            size="text-sm"
            withIcon
            date={convertDateToEpoch(new Date(message.createdAt))}
          />
        )}
      </div>
    </div>
  );
}
function parseAnnotations(annotations: any) {
  if (!annotations) return null;
  // console.log("annotations", annotations[0].mode);
  return annotations[0].mode;
}
function CopyButton({ message }: { message: Message }) {
  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    toast.message("Copied to clipboard");
  }
  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-muted-foreground"
            onClick={handleCopy}
          >
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy</TooltipContent>
      </Tooltip>
    </>
  );
}
