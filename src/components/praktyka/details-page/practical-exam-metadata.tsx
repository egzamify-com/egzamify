import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Box, Calendar } from "lucide-react";
import ExamBadge from "../exam-badge";

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
