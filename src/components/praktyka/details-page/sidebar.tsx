"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { CirclePlay, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function Sidebar({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  const { data: userExam } = useQuery(api.praktyka.query.getUserExam, {
    examId: exam._id,
  });
  const startExam = useMutation(api.praktyka.mutate.startExam);
  const deleteUserExam = useMutation(api.praktyka.mutate.deleteUserExam);
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        <Card>
          <CardContent>
            {userExam && userExam.status === "user_pending" ? (
              <div className="flex w-full flex-col gap-2">
                <Link
                  href={`/dashboard/egzamin-praktyczny/egzamin/${exam._id}#select-sources`}
                >
                  <Button size="lg" className="w-full">
                    Jump to sources
                  </Button>
                </Link>
                <Button
                  variant={"destructive"}
                  size="lg"
                  className="w-full"
                  onClick={async () =>
                    await deleteUserExam({ userExamId: userExam._id })
                  }
                >
                  <Trash2 /> Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={async () => await startExam({ examId: exam._id })}
              >
                <CirclePlay />
                Start exam!
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
