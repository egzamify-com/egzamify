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
    <Link href={`/exam/${exam._id}`}>
      <Card className="group cursor-pointer border-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-xl">
        <CardContent className="p-0">
          <div className="flex">
            {/* Smaller Image */}
            <div className="relative h-20 w-20 flex-shrink-0">
              {/* <Image
                src={exam.image || "/placeholder.svg"}
                alt={exam.title}
                width={80}
                height={80}
                className="h-full w-full rounded-l-lg object-cover transition-transform duration-200 group-hover:scale-105"
              /> */}
              <img />
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {/* Title */}
                <h4 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {exam.qualification?.label ?? "Unknown"}
                </h4>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {/* <span className="mr-1">{statusConfig.icon}</span> */}
                    {/* {statusConfig.label} */}
                    some status here
                  </Badge>
                </div>

                {/* Participants */}
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="mr-1 h-3 w-3" />
                  <span>10 enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
