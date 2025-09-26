import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import { Box, Calendar, Check, IdCard } from "lucide-react";
import Link from "next/link";
import SemanticDate from "~/components/semantic-date";
import ExamBadge from "../exam-badge";

export default function UserExamCard({
  userExam,
}: {
  userExam: PaginatedQueryItem<typeof api.praktyka.query.listUserExams>;
}) {
  const { qualification, examDate } = userExam.baseExam;
  return (
    <Link href={`/dashboard/egzamin-praktyczny/historia/${userExam._id}`}>
      <div className="hover:bg-card flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border border-b p-4 text-left shadow-sm transition-colors">
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">{qualification?.label}</h3>
          <div className="flex w-full items-center justify-start gap-2">
            <ExamBadge
              stat={userExam.baseExam.code}
              icon={<IdCard size={18} />}
            />
            <ExamBadge stat={qualification!.name} icon={<Box size={18} />} />
            <ExamBadge stat={examDate} icon={<Calendar size={18} />} />
            <ExamBadge
              stat={
                <SemanticDate
                  date={userExam._creationTime}
                  color="foreground"
                />
              }
              icon={<Calendar size={18} />}
            />
            <ExamBadge
              stat={`${userExam.aiRating?.score}/${userExam.baseExam.maxPoints}`}
              icon={<Check size={18} />}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
