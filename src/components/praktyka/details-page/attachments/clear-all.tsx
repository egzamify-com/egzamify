import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"

export default function ClearAll({
  userExam,
}: {
  userExam: Doc<"usersPracticalExams">
}) {
  const deleteAttachment = useMutation(api.praktyka.mutate.deleteAttachment)
  const [isPending, setIsPending] = useState(false)
  async function handleClearAll() {
    const promises = userExam.attachments?.map((attachment) => {
      return deleteAttachment({
        attachmentId: attachment.attachmentId,
        userExamId: userExam._id,
      })
    })
    if (!promises) return

    await Promise.all(promises)
  }
  return (
    <>
      <Button
        className="absolute top-0 right-6"
        size={"sm"}
        variant={"destructive"}
        onClick={async () => {
          setIsPending(true)
          await handleClearAll()
          setIsPending(false)
        }}
      >
        {isPending ? (
          <SpinnerLoading />
        ) : (
          <>
            <Trash2 /> Wyczyść wszystkie
          </>
        )}
      </Button>
    </>
  )
}
