import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import { Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export default function ExamItem({
  exam,
}: {
  exam: PaginatedQueryItem<typeof api.praktyka.query.listPracticalExams>;
}) {
  return (
    <Link
      href={`/dashboard/egzamin-praktyczny/egzamin/${exam._id}`}
      key={exam._id}
      className="w-1/3 flex-shrink-0 p-5"
    >
      <Card className="hover:bg-background h-full w-full border shadow-sm transition-all">
        <CardContent className="">
          {/* Content */}
          <div className="space-y-4">
            {/* Title */}
            <h4 className="line-clamp-2 text-sm leading-tight font-semibold transition-colors">
              Styczen 2025
            </h4>

            {/* Difficulty and Status */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary">hard</Badge>
              <Badge variant="secondary">test</Badge>
            </div>

            {/* Participants */}
            <div className="flex items-center text-xs text-gray-500">
              <Users className="mr-1 h-3 w-3" />

              <span>fjdksla</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
