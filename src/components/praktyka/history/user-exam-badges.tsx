import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import { Box, Calendar, Check, IdCard, Star } from "lucide-react";
import SemanticDate from "~/components/semantic-date";
import ExamBadge from "../exam-badge";
import { parseExamScore } from "./details-page/summary-and-score";

export default function UserExamBadges({
  userExam,
}: {
  userExam: PaginatedQueryItem<typeof api.praktyka.query.listUserExams>;
}) {
  return (
    <div className="flex w-full items-center justify-start gap-2">
      <ExamBadge stat={userExam.baseExam.code} icon={<IdCard size={18} />} />
      <ExamBadge
        stat={userExam.baseExam.qualification!.name}
        icon={<Box size={18} />}
      />
      <ExamBadge
        stat={userExam.baseExam.examDate}
        icon={<Calendar size={18} />}
      />
      <ExamBadge
        stat={<SemanticDate date={userExam._creationTime} color="foreground" />}
        icon={<Calendar size={18} />}
      />
      <ExamBadge
        stat={`${userExam.aiRating?.score}/${userExam.baseExam.maxPoints}`}
        icon={<Check size={18} />}
      />
      <ExamBadge
        stat={parseExamScore(
          userExam.aiRating!.score,
          userExam.baseExam.maxPoints,
        )}
      />
      <ExamBadge
        stat={userExam.aiRating?.details ? "Complete check" : "Standard check"}
        icon={<Star size={18} />}
      />
    </div>
  );
}
