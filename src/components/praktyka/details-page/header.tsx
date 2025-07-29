import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

export default function Header({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>
          <h1 className="text-3xl font-bold">{exam.qualification?.name}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p className="text-lg"> {exam.qualification?.label} </p>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
