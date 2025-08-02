import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import Link from "next/link";
import { Badge } from "../ui/badge";
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
      <Card className="hover:bg-background h-full w-full border shadow-sm transition-all">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-start gap-2">
            <Badge variant="secondary">
              <p className="text-md">{exam.qualification?.name}</p>
            </Badge>
            <p> {exam.examDate}</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
