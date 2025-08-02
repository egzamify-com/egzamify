import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import PracticalExamMetadata from "./practical-exam-metadata";

export default function Header({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex flex-col items-start justify-center gap-2">
          {/*<div className="flex w-full flex-row items-center justify-start gap-2">
            <Badge variant={"secondary"} className="text-md">
              {exam.qualification?.name}
            </Badge>
            <Badge variant={"secondary"} className="text-md">
              {exam.examDate}
            </Badge>
          </div>*/}
          <h1 className="text-3xl font-bold">{exam.qualification?.label}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PracticalExamMetadata {...{ exam }} />
      </CardContent>
    </Card>
  );
}
