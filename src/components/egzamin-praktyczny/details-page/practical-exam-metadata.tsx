import type { BaseExam } from "convex/praktyka/helpers"
import { Box, Calendar, IdCard } from "lucide-react"
import ExamBadge from "../exam-badge"

export default function PracticalExamMetadata({ exam }: { exam: BaseExam }) {
  return (
    <div className="flex flex-row gap-2">
      <ExamBadge stat={exam.code} icon={<IdCard size={19} />} />
      {exam.qualification && (
        <ExamBadge stat={exam.qualification.name} icon={<Box size={18} />} />
      )}
      <ExamBadge stat={exam.examDate} icon={<Calendar size={18} />} />
    </div>
  )
}
