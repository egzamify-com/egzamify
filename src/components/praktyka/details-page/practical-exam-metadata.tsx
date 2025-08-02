import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Box, Calendar } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";

export default function PracticalExamMetadata({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <div className="flex flex-row gap-4">
      {exam.qualification && (
        <ExamBadge stat={exam.qualification.name} icon={<Box size={18} />} />
      )}
      <ExamBadge stat={exam.examDate} icon={<Calendar size={18} />} />
    </div>
  );
}
function ExamBadge({ stat, icon }: { stat: string; icon: ReactNode }) {
  return (
    <Badge variant={"secondary"} className="p-2">
      <div className="flex flex-row items-center justify-center gap-2 text-sm">
        {icon}
        <p>{stat}</p>
      </div>
    </Badge>
  );
}
