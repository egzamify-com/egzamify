"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
          <CardTitle>Select sources</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>description</CardDescription>
        </CardContent>
      </Card>
    );
}
