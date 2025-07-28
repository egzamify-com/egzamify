import type { ConvertedExams } from "~/app/dashboard/egzamin-praktyczny/page";

export default function ExamGroup({ group }: { group: ConvertedExams }) {
  console.log("from group - ", group);
  return (
    <div>
      {group.exams.map((exam) => {
        return <div key={`exam-group-${exam._id}`}>{exam._id}</div>;
      })}
    </div>
  );
}
