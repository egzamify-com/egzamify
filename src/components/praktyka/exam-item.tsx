import type { api } from "convex/_generated/api"
import type { PaginatedQueryItem } from "convex/react"
import { Box, Calendar, Award as IdCard } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "../ui/card"

export default function ExamItem({
  exam,
}: {
  exam: PaginatedQueryItem<typeof api.praktyka.query.listPracticalExams>
}) {
  return (
    <Link
      href={`/dashboard/egzamin-praktyczny/egzamin/${exam._id}`}
      key={exam._id}
      className="w-full flex-shrink-0 p-5 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] xl:w-[calc(25%-0.75rem)]"
    >
      <Card className="group hover:border-primary/20 h-full w-full gap-1 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Box size={16} className="text-primary" />
            <span className="font-medium">Kwalifikacja</span>
          </div>
          <h3 className="text-foreground text-lg leading-tight font-semibold">
            {exam.qualification?.name}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center gap-2 text-sm">
            <IdCard size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Kod:</span>
            <span className="text-foreground bg-muted rounded px-2 py-1 font-mono text-xs font-medium">
              {exam.code}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Data:</span>
            <span className="text-foreground font-medium">{exam.examDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
