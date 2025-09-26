import type { Doc } from "convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function SummaryAndScore({
  aiRating,
  baseExam,
}: {
  aiRating: Doc<"usersPracticalExams">["aiRating"];
  baseExam: Doc<"basePracticalExams">;
}) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Summary of Performance</h3>
        <p className="text-muted-foreground leading-relaxed">
          {aiRating?.summary}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg p-4 shadow-sm">
        <div className="text-primary text-5xl font-extrabold">
          {aiRating?.score && (
            <>{parseScore(aiRating.score, baseExam.maxPoints)}%</>
          )}
        </div>
        <div className="text-muted-foreground text-lg">
          {aiRating?.score} / {baseExam.maxPoints} Points
        </div>
        <Link href={`/dashboard/egzamin-praktyczny/egzamin/${baseExam?._id}`}>
          <Button className="mt-4 w-full max-w-[200px]">Retry Exam</Button>
        </Link>
      </div>
    </div>
  );
}
function parseScore(score: number, maxPoints: number) {
  return Math.round((score / maxPoints) * 100);
}
