import { Box, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ConvertedExams } from "~/app/dashboard/egzamin-praktyczny/page";
import { cn } from "~/lib/utils";
import ExamBadge from "./exam-badge";
import ExamItem from "./exam-item";

export default function ExamGroup({ group }: { group: ConvertedExams }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <button
        className="hover:bg-card w-full cursor-pointer border-b p-4 text-left transition-colors"
        onClick={() => setIsExpanded((old) => !old)}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-2">
            <ExamBadge
              icon={<Box size={18} />}
              stat={`${group.exams[0]?.qualification?.name}`}
            />

            <h3 className="text-lg font-semibold">
              {group.exams[0]?.qualification?.label}
            </h3>
          </div>

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
        <div className="flex flex-wrap gap-4 pb-2">
          {group.exams.map((exam) => (
            <ExamItem key={exam._id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
