import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import RequirementsTable from "./requirements-table";
import SummaryAndScore from "./summary-and-score";

export function ExamRating({
  userExam,
}: {
  userExam: FunctionReturnType<typeof api.praktyka.query.getUserExamDetails>;
}) {
  const { aiRating } = userExam;
  return (
    <>
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Exam Rating
          </CardTitle>
          <CardDescription className="mt-2 text-center">
            {`Here's a detailed breakdown of your performance.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <SummaryAndScore aiRating={aiRating} baseExam={userExam.baseExam} />

          {aiRating?.details ? (
            <RequirementsTable aiRating={userExam.aiRating} />
          ) : (
            <div className="flex items-center justify-center rounded-lg border p-5">
              <h1 className="">
                Buy complete AI check to see specific requirements
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
