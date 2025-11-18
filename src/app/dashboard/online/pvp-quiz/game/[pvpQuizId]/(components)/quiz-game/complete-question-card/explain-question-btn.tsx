"use client"

import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { useStore } from "@tanstack/react-store"
import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { motion } from "framer-motion"
import { Gem, Stars } from "lucide-react"
import { toast } from "sonner"
import { explainQuestion } from "~/actions/explain-question"
import { APP_CONFIG } from "~/APP_CONFIG"
import GetCreditsAlert from "~/components/get-credits-alert"
import MarkdownRenderer from "~/components/markdown-rendered"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tooltip, TooltipContent } from "~/components/ui/tooltip"
import { tryCatch } from "~/lib/tryCatch"
import { questionDialogStore, updateQuestionDialog } from "../../../store"
import type { CompleteQuestionProps } from "./complete-question"
import CompleteQuestion from "./complete-question"

export default function ExplainQuestionBtn({
  question,
  answers,
}: {
  question: CompleteQuestionProps["question"]
  answers: CompleteQuestionProps["answers"]
}) {
  const currentUser = useQuery(api.users.query.getCurrentUser)
  const questionStore = useStore(questionDialogStore)
  const questionDialogState = questionStore.get(question._id)
  const canUserAfford =
    !currentUser.isPending &&
    (currentUser.data?.credits ?? 0) > APP_CONFIG.questionExplanation.price

  async function fetchExplanation() {
    if (questionDialogState?.explanation) {
      updateQuestionDialog(question._id, { isOpen: true })
      return
    }

    updateQuestionDialog(question._id, { isPending: true })
    const [res, err] = await tryCatch(explainQuestion(question, answers))

    if (err) {
      console.error(err)
      toast.error(APP_CONFIG.defaultFullScreenErrorMessage, {
        description: err.message,
      })
      updateQuestionDialog(question._id, { isPending: false })
      return
    }

    updateQuestionDialog(question._id, { isOpen: true })
    updateQuestionDialog(question._id, { explanation: res })
    updateQuestionDialog(question._id, { isPending: false })
  }

  function SubmitBtnMarkup() {
    return (
      <>
        {questionDialogState?.isPending ? (
          <span className="flex h-full w-full flex-row items-center justify-center gap-2">
            <SpinnerLoading /> {"Wyjaśniamy "}
          </span>
        ) : (
          <>
            <span className="flex h-full w-full flex-row items-center justify-center gap-2">
              <Stars />
              {questionDialogState?.explanation ? (
                <p>{"Pokaż wyjaśnienie"}</p>
              ) : (
                <p>{"Wyjaśnij"}</p>
              )}
            </span>
          </>
        )}
      </>
    )
  }

  return (
    <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 1 }}>
      <Tooltip>
        <TooltipTrigger>
          {canUserAfford ? (
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={async () => {
                await fetchExplanation()
              }}
            >
              <SubmitBtnMarkup />
            </Button>
          ) : (
            <GetCreditsAlert>
              <Button variant={"ghost"} size={"sm"}>
                <SubmitBtnMarkup />
              </Button>
            </GetCreditsAlert>
          )}
        </TooltipTrigger>
        <TooltipContent className="flex flex-row items-center justify-center gap-2">
          <Gem size={16} />{" "}
          <p className="text-md">{APP_CONFIG.questionExplanation.price}</p>
        </TooltipContent>
      </Tooltip>
      <Dialog
        open={questionDialogState?.isOpen}
        onOpenChange={(newValue: boolean) => {
          console.log({ newValue })
          console.log("on open change")
          updateQuestionDialog(question._id, { isOpen: newValue })
        }}
      >
        <DialogContent className="min-w-1/2">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex flex-row items-center justify-start gap-2">
              <Stars />
              <p className="text-xl">{"Wyjaśnijmy to pytanie z AI"}</p>
            </DialogTitle>
            <Card className="bg-transparent p-6">
              <ScrollArea className="h-[300px] w-full">
                <CompleteQuestion
                  {...{
                    question: question,
                    answers: answers,
                    nonInteractive: true,
                    showQuestionMetadata: true,
                    showExplanationBtn: false,
                    showCorrectAnswer: true,
                  }}
                />
              </ScrollArea>
            </Card>
          </DialogHeader>
          {questionDialogState?.explanation &&
            !questionDialogState?.isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-6">
                  <ScrollArea className="h-[300px] w-full">
                    <MarkdownRenderer
                      markdownText={questionDialogState.explanation}
                      textSize="prose-md"
                    />
                  </ScrollArea>
                </Card>
              </motion.div>
            )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
