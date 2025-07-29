import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { Suspense } from "react";
import FullScreenError from "~/components/full-screen-error";
import AttachmentsCard from "~/components/praktyka/details-page/attachments-card";
import BackToExams from "~/components/praktyka/details-page/back-exams-btn";
import Header from "~/components/praktyka/details-page/header";
import { Instructions } from "~/components/praktyka/details-page/instructions";
import AttachmentsList from "~/components/praktyka/details-page/render-attachments-list";
import Sidebar from "~/components/praktyka/details-page/sidebar";
import { ExamDetailSkeleton } from "~/components/praktyka/loadings";
import { tryCatch } from "~/lib/tryCatch";
type PropsType = Promise<{ examId: string }>;

export default async function Page({ params }: { params: PropsType }) {
  return (
    <>
      <Suspense fallback={<ExamDetailSkeleton />}>
        <Component params={params} />
      </Suspense>
    </>
  );
}

async function Component({ params }: { params: PropsType }) {
  const { examId } = await params;
  const [exam, error] = await tryCatch(getExam(examId));
  if (error) {
    console.log("[ERROR]", error);
    return (
      <FullScreenError
        errorMessage="Failed to load exam"
        errorDetail={error.message}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <BackToExams />
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Header {...{ exam }} />
            <AttachmentsCard {...{ exam }}>
              <AttachmentsList {...{ exam }} />
            </AttachmentsCard>
            <Instructions {...{ exam }} />
          </div>
          <Sidebar {...{ exam }} />
        </div>
      </div>
    </div>
  );
}

async function getExam(id: string) {
  return await fetchQuery(
    api.praktyka.query.getExamDetails,
    {
      examId: id as Id<"basePracticalExams">,
    },
    { token: await convexAuthNextjsToken() },
  );
}
