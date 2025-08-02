import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/custom_helpers";
import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ConvertedExams } from "~/app/dashboard/egzamin-praktyczny/page";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import ExamItem from "./exam-item";

export default function ExamGroup({ group }: { group: ConvertedExams }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: qualification, isPending } = useQuery(
    api.teoria.query.getQualificationDetails,
    {
      qualificationId: group.qualificationId as Id<"qualifications">,
    },
  );
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <button
        className="hover:bg-card w-full cursor-pointer border-b p-4 text-left transition-colors"
        onClick={() => setIsExpanded((old) => !old)}
      >
        <div className="flex items-center justify-between">
          {isPending ? (
            <Skeleton className="mb-2 h-5 w-80" />
          ) : (
            <div className="flex flex-row gap-2">
              <Badge variant={"secondary"}>{qualification?.name}</Badge>

              <h3 className="text-lg font-semibold">{qualification?.label}</h3>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {group.count === 1 ? "1 exam" : `${group.count} exams`}{" "}
                available
              </span>
            </div>
            <ChevronDown
              className={cn(
                `h-5 w-5 transition-transform`,
                isExpanded ? "rotate-180" : "",
              )}
            />
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="flex flex-row flex-wrap overflow-y-auto pb-2">
          {group.exams.map((exam) => (
            <ExamItem key={exam._id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
