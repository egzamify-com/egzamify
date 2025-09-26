"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Brain, Files } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  requestPracticalExamCheck,
  type PracticalExamCheckMode,
} from "~/actions/request-practical-exam-check-action";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SelectSourceSkeleton } from "../loadings";
import AttachmentItem from "./attachments/attachment-item";
import ClearAll from "./attachments/clear-all";
import { DeleteAttachment } from "./attachments/delete-exam-attachment";
import UploadAttachment from "./attachments/upload-attachment";
import SelectMode from "./select-mode";
export default function SelectSources({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  const { data: userExam, isPending } = useQuery(
    api.praktyka.query.getUserExamFromExamId,
    {
      examId: exam._id,
    },
  );
  const [selectedMode, setSelectedMode] =
    useState<PracticalExamCheckMode>("standard");
  console.log({ selectedMode });
  if (isPending) return <SelectSourceSkeleton />;
  if (!userExam) return null;
  if (userExam)
    return (
      <Card className="gap-2">
        <CardHeader className="relative flex items-start justify-between">
          <CardTitle className="flex flex-row items-center justify-start gap-1">
            <Files className="mr-2 h-5 w-5" />
            <h2>Select sources</h2>
          </CardTitle>
          {userExam.attachments && userExam.attachments.length > 0 && (
            <ClearAll {...{ userExam }} />
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CardDescription>
            <p className="text-sm">Here upload your exam files.</p>
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
              {userExam.attachments?.length === 0 && (
                <p className="text-muted-foreground">No attachments added.</p>
              )}
              <UploadAttachment {...{ userExam }} />
            </div>
          </div>

          <SelectMode {...{ selectedMode, setSelectedMode }} />
          <CardAction className="flex w-full flex-row items-end justify-end gap-4">
            <Link
              href={`/dashboard/egzamin-praktyczny/historia/${userExam._id}`}
            >
              <Button
                disabled={!userExam.attachments}
                onClick={async () => {
                  await requestPracticalExamCheck(userExam._id, selectedMode);
                }}
              >
                <Brain /> Check your exam with AI
              </Button>
            </Link>
          </CardAction>
        </CardContent>
      </Card>
    );
}
