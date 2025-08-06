"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/custom_helpers";
import { use } from "react";
import FullScreenError from "~/components/full-screen-error";
import AttachmentsCard from "~/components/praktyka/details-page/attachments/attachments-card";
import { Instructions } from "~/components/praktyka/details-page/instructions";
import UserExamCheckHeader from "~/components/praktyka/history/details-page/header";
import { ExamRating } from "~/components/praktyka/history/details-page/rating";
import { MainContentLoading } from "~/components/praktyka/loadings";

export default function PraktykaPage({
  params,
}: {
  params: Promise<{ userExamId: Id<"usersPracticalExams"> }>;
}) {
  const { userExamId } = use(params);
  const {
    data: userExam,
    isPending,
    isError,
    error,
  } = useQuery(api.praktyka.query.getUserExamDetails, {
    userExamId,
  });

  if (isError) return <FullScreenError errorDetail={error.message} />;

  if (!isPending && !userExam) return <FullScreenError />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        {isPending && <MainContentLoading />}
        {!isPending && userExam?.status === "ai_pending" && (
          <MainContentLoading title="Ai is processing your exam" />
        )}
        {!isPending && userExam?.status == "done" && (
          <>
            <UserExamCheckHeader {...{ userExam }} />
            <ExamRating {...{ userExam }} />
          </>
        )}

        {userExam && (
          <>
            <Instructions exam={userExam.baseExam} />
            {userExam.attachments && (
              <AttachmentsCard
                attachmentList={userExam.attachments}
                customTitle="Your attachments"
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
