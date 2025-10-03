"use client"

import { ChevronDown, Download } from "lucide-react"

import type { practicalExamAttachmentValidator } from "convex/praktyka/helpers"
import type { Infer } from "convex/values"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import AttachmentItem from "./attachment-item"

export default function AttachmentsCard({
  attachmentList,
  customTitle,
}: {
  attachmentList: Infer<typeof practicalExamAttachmentValidator>
  customTitle?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <>
      <Card
        className={cn("cursor-pointer transition-colors", "hover:bg-muted")}
        onClick={() => setIsExpanded((old) => !old)}
      >
        <CardHeader className="">
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-end justify-center gap-1">
              <Download className="mr-2 h-5 w-5" />
              {customTitle ?? "Pliki egzaminacyjne"}
            </div>
            <Button variant={"ghost"}>
              <ChevronDown
                className={cn(
                  `h-5 w-5 transition-transform`,
                  isExpanded ? "rotate-180" : "",
                )}
              />
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
      {isExpanded && (
        <CardContent className={`flex flex-col gap-4`}>
          {attachmentList.map((attachment) => {
            return (
              <AttachmentItem
                key={`attachment-${attachment.attachmentId}`}
                attachmentId={attachment.attachmentId}
                attachmentName={attachment.attachmentName}
              />
            )
          })}
        </CardContent>
      )}
    </>
  )
}
