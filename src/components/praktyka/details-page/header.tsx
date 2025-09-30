import type { BaseExam } from "convex/praktyka/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import PracticalExamMetadata from "./practical-exam-metadata"

export default function Header({ exam }: { exam: BaseExam }) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex flex-col items-start justify-center gap-2">
          <h1 className="text-3xl font-bold">{exam.qualification?.label}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PracticalExamMetadata {...{ exam }} />
      </CardContent>
    </Card>
  )
}
