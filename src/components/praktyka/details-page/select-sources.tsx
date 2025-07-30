"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Trash2, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import AttachmentItem from "./attachment-item";

export default function SelectSources({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  const { data: userExam } = useQuery(api.praktyka.query.getUserExam, {
    examId: exam._id,
  });
  if (!userExam) return null;
  if (userExam && userExam.status === "user_pending")
    return (
      <Card id="select-sources">
        <CardHeader>
          <CardTitle>
            <h1>Select sources</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CardDescription>Here upload your exam files.</CardDescription>
          <div className="w-full">
            <AttachmentItem
              attachmentName="test name"
              url="url"
              actionButtons={
                <Button variant={"destructive"}>
                  <Trash2 /> Delete
                </Button>
              }
            />
          </div>
          <CardAction className="flex w-full flex-row items-end justify-end">
            <Button>
              <Upload /> Upload
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    );
}
