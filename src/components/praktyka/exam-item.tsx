import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "../ui/card";

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
      <Card className="hover:bg-background h-full w-full gap-2 border shadow-sm transition-all">
        <CardHeader>
          <CardTitle>
            <h1>{exam.examDate}</h1>
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
