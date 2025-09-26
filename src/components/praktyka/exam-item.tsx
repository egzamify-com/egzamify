import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import { Box, Calendar, IdCard } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import ExamBadge from "./exam-badge";

export default function ExamItem({
  exam,
}: {
  exam: PaginatedQueryItem<typeof api.praktyka.query.listPracticalExams>;
}) {
  return (
    <Link
      href={`/dashboard/egzamin-praktyczny/egzamin/${exam._id}`}
      key={exam._id}
      className="w-1/4 flex-shrink-0 p-5"
    >
      <Card className="hover:bg-background h-full w-full border shadow-sm transition-all">
        <CardHeader className="flex w-full flex-row flex-wrap items-center justify-start">
          <ExamBadge
            icon={<Box size={18} />}
            stat={`${exam.qualification?.name}`}
          />
          <ExamBadge icon={<IdCard size={18} />} stat={`${exam.code}`} />
          <ExamBadge icon={<Calendar size={18} />} stat={`${exam.examDate}`} />
        </CardHeader>
      </Card>
    </Link>
  );
}
