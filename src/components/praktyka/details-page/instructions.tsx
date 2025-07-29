import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { FileText } from "lucide-react";
import Markdown from "marked-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const Instructions = ({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="mr-2 h-5 w-5" />
          Exam Instructions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-md dark:prose-invert max-w-none">
          <Markdown>{exam.examInstructions}</Markdown>
        </div>
      </CardContent>
    </Card>
  );
};
