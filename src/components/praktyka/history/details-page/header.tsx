import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import UserExamBadges from "../user-exam-badges";

export default function UserExamCheckHeader({
  userExam,
}: {
  userExam: FunctionReturnType<typeof api.praktyka.query.getUserExamDetails>;
}) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex flex-col items-start justify-center gap-2">
          <h1 className="text-3xl font-bold">
            {userExam.baseExam.qualification?.label}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserExamBadges {...{ userExam }} />
      </CardContent>
    </Card>
  );
}
