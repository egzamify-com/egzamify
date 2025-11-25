import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import { Bot, X } from "lucide-react"
import Link from "next/link"
import SpinnerLoading from "~/components/spinner-loading"
import { Item, ItemActions, ItemContent } from "~/components/ui/item"
import { cn } from "~/lib/utils"

export default function PracticalExamWidget() {
  const deleteUserExam = useMutation(api.praktyka.mutate.deleteUserExam)

  const {
    data: pendingExams,
    isPending,
    error,
  } = useQuery(api.praktyka.query.getLatestUserPendingExam)

  const markAsSeen = useMutation(api.praktyka.mutate.markExamAsSeen)

  console.log({ pendingExams })
  if (isPending) return null
  if (error) return null
  if (pendingExams.length === 0) return null

  return (
    <div className="flex flex-col gap-2 p-0">
      {pendingExams.map((exam, index) => (
        <div key={crypto.randomUUID()}>
          {index < 3 && (
            <Link href={`/dashboard/egzamin-praktyczny/historia/${exam._id}`}>
              <Item
                variant="outline"
                className={cn(
                  "hover:bg-muted rounded-xl transition-all ease-in-out",
                  exam.status === "done" && "border border-green-500",
                )}
              >
                <ItemContent className="flex flex-row items-center justify-start gap-1">
                  <Bot />
                  <span className="text-foreground bg-muted rounded px-2 py-1 font-mono text-xs font-medium">
                    {exam.baseExam.code}
                  </span>
                </ItemContent>
                <ItemActions className="m-0 flex flex-row gap-1">
                  {exam.status === "done" ? (
                    <div className="flex flex-col gap-2">
                      <p
                        className="text-lg font-semibold"
                        onClick={async () =>
                          markAsSeen({ userExamId: exam._id })
                        }
                      >
                        Egzamin sprawdzony!
                      </p>
                      <p className="text-muted-foreground">Skocz do wyniku</p>
                    </div>
                  ) : (
                    <>
                      <SpinnerLoading size={20} />
                      <X
                        className="text-destructive"
                        size={20}
                        onClick={async () =>
                          deleteUserExam({ userExamId: exam._id })
                        }
                      />
                    </>
                  )}
                </ItemActions>
              </Item>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
