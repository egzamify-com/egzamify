import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { Bot } from "lucide-react"
import Link from "next/link"
import SpinnerLoading from "~/components/spinner-loading"
import { Item, ItemActions, ItemContent } from "~/components/ui/item"

export default function PracticalExamWidget() {
  const {
    data: pendingExams,
    isPending,
    error,
  } = useQuery(api.praktyka.query.getLatestUserPendingExam)

  if (isPending) return null
  if (error) return null
  if (pendingExams.length === 0) return null
  console.log({ pendingExams })
  return (
    <div className="flex flex-col gap-2 p-0">
      {pendingExams.map((exam, index) => (
        <div key={crypto.randomUUID()}>
          {index < 3 && (
            <Link href={`/dashboard/egzamin-praktyczny/historia/${exam._id}`}>
              <Item variant="outline" className="rounded-xl">
                <ItemContent className="flex flex-row items-center justify-start gap-2">
                  <Bot />
                  <span className="text-foreground bg-muted rounded px-2 py-1 font-mono text-xs font-medium">
                    {exam.baseExam.code}
                  </span>
                </ItemContent>
                <ItemActions>
                  <SpinnerLoading size={20} />
                </ItemActions>
              </Item>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
