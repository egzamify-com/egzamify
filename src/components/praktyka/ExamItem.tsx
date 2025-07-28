import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export default function ExamItem({
  exam,
}: {
  exam: FunctionReturnType<
    typeof api.praktyka.query.listPracticalExams
  >[number];
}) {
  return (
    <div className="exam-item">
      <h3>{exam.qualification?.name}</h3>
      <p>{exam.qualificationId}</p>
      <p>{exam.code}</p>
    </div>
  );
}
