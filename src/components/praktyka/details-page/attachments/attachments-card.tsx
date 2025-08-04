"use client";

import { ChevronDown, Download } from "lucide-react";

import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import AttachmentItem from "./attachment-item";

export default function AttachmentsCard({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
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
              Reference Materials & Attachments
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
          {exam.examAttachments.map((attachment) => {
            return (
              <AttachmentItem
                key={`attachment-${attachment.attachmentId}`}
                attachmentId={attachment.attachmentId}
                attachmentName={attachment.attachmentName}
              />
            );
          })}
        </CardContent>
      )}
    </>
  );
}
