"use client"

import { api } from "convex/_generated/api"
import type { FeedbackType } from "convex/feedback/feedback"
import { useAction } from "convex/react"
import { Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SpinnerLoading from "~/components/SpinnerLoading"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"

const items: FeedbackType[] = ["Bug report", "Feature request", "User feedback"]

const defaultType: FeedbackType = "User feedback"

export default function Page() {
  const sendFeedback = useAction(api.feedback.feedback.sendFeedback)
  const [content, setContent] = useState("")
  const [selectedType, setSelectedType] = useState<FeedbackType>(defaultType)
  const [isActionPending, setIsActionPending] = useState(false)
  return (
    <div className="flex flex-1 flex-col items-center justify-start pt-10">
      <div className="flex flex-col items-center justify-center gap-2 p-40">
        <div>
          <h1 className="text-center text-3xl font-bold">Send feedback!</h1>
          <p>
            If you want to give us feedback about the about, or you found a bug,
            feel free to tell us here.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="feedback-input">Your thoughts on the app</Label>
            <Textarea
              id="feedback-input"
              placeholder="..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Select
              onValueChange={(e: FeedbackType) => setSelectedType(e)}
              defaultValue={defaultType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => {
                  return (
                    <SelectItem key={crypto.randomUUID()} value={item}>
                      {item}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button
              onClick={async () => {
                console.log({ content })
                console.log({ selectedType })
                setIsActionPending(true)
                try {
                  await sendFeedback({ content, type: selectedType })
                  setIsActionPending(false)
                  setContent("")
                  toast.success("Feedback sent successfully.", {
                    description: "Thank you for your feedback!",
                  })
                } catch (e) {
                  setIsActionPending(false)
                  console.error("[FEEDBACK] Error while sending feedback: ", e)
                  toast.error("Sorry, failed to send feedback.", {
                    description:
                      "You may have reached the limit of sent reports for an hour. Please try again later.",
                  })
                }
              }}
            >
              {isActionPending ? (
                <SpinnerLoading />
              ) : (
                <>
                  <Send />
                  <p>Send</p>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
