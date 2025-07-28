import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ConvertedExams } from "~/app/dashboard/egzamin-praktyczny/page";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import ExamItem from "./exam-item";

export default function ExamGroup({ group }: { group: ConvertedExams }) {
  console.log("from group - ", group);
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
        className="w-full border-b p-4 text-left transition-colors"
        onClick={() => setIsExpanded((old) => !old)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {qualification?.name ?? <Skeleton className="mb-2 h-5 w-80" />}
            </h3>
            <div className="mt-1 flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {group.count === 1 ? "1 exam" : `${group.count} exams`}{" "}
                available
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="">
              {group.count === 1 ? "1 exam" : `${group.count} exams`}
            </Badge>
            <div className="flex items-center text-gray-400">
              {isExpanded ? (
                <>
                  <span className="mr-2 text-xs">Hide</span>
                  <ChevronUp className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span className="mr-2 text-xs">
                    {group.count === 1 ? "Show exam" : "Show all"}
                  </span>
                  <ChevronDown className="h-5 w-5" />
                </>
              )}
            </div>
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
