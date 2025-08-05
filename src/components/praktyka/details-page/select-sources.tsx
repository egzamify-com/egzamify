"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Brain, Files } from "lucide-react";
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
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { SelectSourceSkeleton } from "../loadings";
import AttachmentItem from "./attachments/attachment-item";
import { DeleteAttachment } from "./attachments/delete-exam-attachment";
import UploadAttachment from "./attachments/upload-attachment";
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
  if (isPending) return <SelectSourceSkeleton />;
  if (!userExam) return null;
  if (userExam && userExam.status === "user_pending")
    return (
      <Card id="select-sources" className="gap-2">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-start gap-1">
            <Files className="mr-2 h-5 w-5" /> Select sources
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CardDescription>Here upload your exam files.</CardDescription>
          <div className="flex w-full flex-col gap-4">
            {userExam.attachments?.map((attachment) => (
              <AttachmentItem
                key={`user-exam-attachment-${attachment.attachmentName}`}
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
          </div>
          <RadioGroup
            defaultValue="standard"
            onValueChange={(value: PracticalExamCheckMode) =>
              setSelectedMode(value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label
                htmlFor="option-one"
                className="flex flex-col items-start justify-center"
              >
                <h3>Standard</h3>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="complete" id="complete" />
              <Label htmlFor="option-two">Complete breakdown</Label>
            </div>
          </RadioGroup>
          <CardAction className="flex w-full flex-row items-end justify-end gap-4">
            <UploadAttachment {...{ userExam }} />
            <Button
              onClick={async () => {
                await requestPracticalExamCheck(userExam._id, selectedMode);
              }}
            >
              <Brain /> Check your exam with AI
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    );
}
