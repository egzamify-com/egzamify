import { Clock } from "lucide-react";
// Import the revised functions that expect/return milliseconds
import { cn } from "~/lib/utils";
import {
  convertEpochToYYYYMMDD,
  type EpochMilliseconds,
  toSemanticTime,
} from "~/utils/dateUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SemanticDate({
  date, // This `date` should now consistently be EpochMilliseconds
  withIcon,
  size = "text-sm",
}: {
  date: EpochMilliseconds; // Explicitly type as EpochMilliseconds
  withIcon?: boolean;
  size?: "text-xs" | "text-sm" | "text-md" | "text-lg" | "text-xl" | "text-2xl";
}) {
  // convertEpochToYYYYMMDD now expects milliseconds, which it gets from `date`
  const yyyymmddDate = convertEpochToYYYYMMDD(date);
  // toSemanticTime expects YYYY/MM/DD string, so we correctly convert the milliseconds first
  const semanticDate = toSemanticTime(yyyymmddDate);

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          `text-muted-foreground flex cursor-pointer flex-row items-center justify-center gap-2`,
          size,
        )}
      >
        {withIcon && (
          <>
            <Clock className="h-3 w-3" />
          </>
        )}
        <p>{semanticDate}</p>
      </TooltipTrigger>
      <TooltipContent>
        <p>{yyyymmddDate}</p>
      </TooltipContent>
    </Tooltip>
  );
}
