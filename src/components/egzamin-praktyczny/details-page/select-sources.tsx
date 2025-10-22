"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import type { BaseExam, UserExam } from "convex/praktyka/helpers"
import { Files, Gem } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  requestPracticalExamCheck,
  type PracticalExamCheckMode,
} from "~/actions/request-practical-exam-check-action"
import { APP_CONFIG } from "~/APP_CONFIG"
import FullScreenError from "~/components/full-screen-error"
import GetCreditsAlert from "~/components/get-credits-alert"
import SpinnerLoading from "~/components/spinner-loading"
import { Button, type ButtonProps } from "~/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import AttachmentItem from "./attachments/attachment-item"
import ClearAll from "./attachments/clear-all"
import { DeleteAttachment } from "./attachments/delete-exam-attachment"
import UploadAttachment from "./attachments/upload-attachment"
import SelectMode from "./select-mode"
export default function SelectSources({
  userExam,
  baseExam,
}: {
  userExam: UserExam
  baseExam: BaseExam
}) {
  const { data: user } = useQuery(api.users.query.getCurrentUser)
  const [isSubmittingExamCheck, setIsSubmittingExamCheck] = useState(false)
  const [selectedMode, setSelectedMode] =
    useState<PracticalExamCheckMode>("standard")
  const router = useRouter()
  const canUserAfford =
    user && (user.credits ?? 0) >= getModePrice(selectedMode)

  if (!userExam || !baseExam)
    return <FullScreenError errorMessage="No user exam found" />
  return (
    <Card className="w-full gap-2 border-0 bg-transparent px-0 py-0 shadow-transparent">
      <CardHeader className="relative flex items-start justify-between px-0">
        <CardTitle className="flex flex-row items-center justify-start gap-1 px-0">
          <Files className="mr-2 h-5 w-5" />
          <h2>Prześlij swoje rozwiązanie</h2>
        </CardTitle>
        {userExam.attachments && userExam.attachments.length > 0 && (
          <ClearAll {...{ userExam }} />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <CardDescription>
          <p className="text-sm">Dodaj tutaj swoje pliki.</p>
        </CardDescription>
        <div className="flex w-full flex-col gap-4">
          {userExam.attachments?.map((attachment) => (
            <AttachmentItem
              key={`user-exam-attachment-${attachment.attachmentId}`}
              attachmentName={attachment.attachmentName}
              attachmentId={attachment.attachmentId}
              actionButtons={
                <DeleteAttachment
                  attachmentId={attachment.attachmentId}
                  userExamId={userExam._id}
                />
              }
            />
          ))}

          <div className="flex w-full flex-col items-center justify-center gap-4">
            <UploadAttachment {...{ userExam }} />
          </div>
        </div>

        <SelectMode {...{ selectedMode, setSelectedMode }} />
        <CardAction className="flex w-full flex-row items-end justify-end gap-4">
          {canUserAfford ? (
            <SubmitButton
              disabled={!userExam.attachments || isSubmittingExamCheck}
              onClick={async (e) => {
                if (!userExam.attachments) {
                  toast.error("Upload some attachments first")
                  e.preventDefault()
                  return
                }

                setIsSubmittingExamCheck(true)
                await requestPracticalExamCheck(userExam._id, selectedMode)

                router.replace(
                  `/dashboard/egzamin-praktyczny/historia/${userExam._id}`,
                )
                setIsSubmittingExamCheck(false)
              }}
            >
              {isSubmittingExamCheck ? (
                <SpinnerLoading />
              ) : (
                <SubmitButtonContent />
              )}
            </SubmitButton>
          ) : (
            <GetCreditsAlert>
              <SubmitButton disabled={!userExam.attachments}>
                <SubmitButtonContent />
              </SubmitButton>
            </GetCreditsAlert>
          )}
        </CardAction>
      </CardContent>
    </Card>
  )
}

function SubmitButtonContent() {
  return (
    <>
      <Gem /> Sprawdź swoją prace z AI
    </>
  )
}
function SubmitButton({ ...props }: ButtonProps) {
  return (
    <Button size={"lg"} className="w-1/4" {...props}>
      {props.children}
    </Button>
  )
}
function getModePrice(mode: PracticalExamCheckMode) {
  if (mode === "standard") return APP_CONFIG.practicalExamRating.standardPrice
  if (mode === "complete") return APP_CONFIG.practicalExamRating.completePrice
  return APP_CONFIG.practicalExamRating.completePrice
}
