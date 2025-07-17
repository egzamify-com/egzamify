import { Clock } from "lucide-react";
import { convertEpochToYYYYMMDD, toSemanticTime } from "~/utils/dateUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SemanticDate({
  date,
  withIcon,
}: {
  date: number;
  withIcon?: boolean;
}) {
  const yyyymmddDate = convertEpochToYYYYMMDD(date);
  const semanticDate = toSemanticTime(convertEpochToYYYYMMDD(date));
  return (
    <Tooltip>
      <TooltipTrigger className="flex cursor-pointer flex-row items-center justify-center gap-2">
        {withIcon && (
          <>
            <Clock className="h-3 w-3" />
          </>
        )}
        {semanticDate}
      </TooltipTrigger>
      <TooltipContent>
        <p>{yyyymmddDate}</p>
      </TooltipContent>
    </Tooltip>
  );
}
