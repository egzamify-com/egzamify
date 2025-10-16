"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import { use } from "react"
import FullScreenError from "~/components/full-screen-error"
import AttachmentsCard from "~/components/praktyka/details-page/attachments/attachments-card"
import BackToExams from "~/components/praktyka/details-page/back-exams-btn"
import Header from "~/components/praktyka/details-page/header"
import { Instructions } from "~/components/praktyka/details-page/instructions"
import SelectSources from "~/components/praktyka/details-page/select-sources"
import { ExamDetailSkeleton } from "~/components/praktyka/loadings"
import { parseConvexError } from "~/lib/utils"

export default function Page({
  params,
}: {
  params: Promise<{ examCode: string }>
}) {
  const { examCode } = use(params)
  const startUserExam = useMutation(api.praktyka.mutate.startExam)
  const { data, isPending, error } = useQuery(
    api.praktyka.query.getUserExamFromExamCode,
    {
      examCode: examCode,
    },
  )

  if (isPending) {
    return <ExamDetailSkeleton />
  }

  if (error && !isPending) {
    console.error("[EXAM PAGE ERROR]", error)
    return (
      <FullScreenError
        errorMessage="Nie udało się załadować egzaminu"
        errorDetail={parseConvexError(error)}
      />
    )
  }

  if (!data.baseExam) {
    console.error("[ERROR]", error)
    return (
      <FullScreenError
        errorMessage="Failed to load exam"
        errorDetail={"This exam does not exists"}
      />
    )
  }

  if (!data.userExam) {
    console.warn("auto starting exam for user!")
    startUserExam({ examId: data.baseExam._id })
    return <ExamDetailSkeleton />
  }

  if (data.userExam) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <BackToExams />
          <div>
            <div className="space-y-6 lg:col-span-3">
              <Header exam={data.baseExam} />
              <AttachmentsCard attachmentList={data.baseExam.examAttachments} />
              <Instructions exam={data.baseExam} />
              <SelectSources
                baseExam={data.baseExam}
                userExam={data.userExam}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
