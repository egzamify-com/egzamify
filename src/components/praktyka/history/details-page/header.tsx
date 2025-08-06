import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Box, Calendar, Check } from "lucide-react";
import SemanticDate from "~/components/semantic-date";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ExamBadge from "../../exam-badge";

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
        <div className="flex flex-row gap-2">
          <ExamBadge
            stat={userExam.baseExam.qualification.name}
            icon={<Box size={18} />}
          />
          <ExamBadge
            stat={userExam.baseExam.examDate}
            icon={<Calendar size={18} />}
          />
          <ExamBadge
            stat={
              <SemanticDate date={userExam._creationTime} color="foreground" />
            }
            icon={<Calendar size={18} />}
          />
          <ExamBadge
            stat={`${userExam.aiRating?.score}/${userExam.baseExam.maxPoints}`}
            icon={<Check size={18} />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
