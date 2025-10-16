"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import Link from "next/link"
import { use } from "react"
import FullScreenError from "~/components/full-screen-error"
import AttachmentsCard from "~/components/praktyka/details-page/attachments/attachments-card"
import { Instructions } from "~/components/praktyka/details-page/instructions"
import UserExamCheckHeader from "~/components/praktyka/history/details-page/header"
import { ExamRating } from "~/components/praktyka/history/details-page/rating"
import { ExamLoadingScreen } from "~/components/praktyka/history/details-page/wait-for-generated-check"
import { MainContentLoading } from "~/components/praktyka/loadings"
import { Button } from "~/components/ui/button"

export default function PraktykaPage({
  params,
}: {
  params: Promise<{ userExamId: Id<"usersPracticalExams"> }>
}) {
  const { userExamId } = use(params)
  const {
    data: userExam,
    isPending,
    isError,
    error,
  } = useQuery(api.praktyka.query.getUserExamDetails, {
    userExamId,
  })
  const updateStatus = useMutation(api.praktyka.mutate.updateUserExamStatus)

  if (isError)
    return (
      <FullScreenError
        errorMessage="Wystąpił nieoczekiwany problem."
        errorDetail={error.message}
      />
    )

  if (!isPending && !userExam)
    return <FullScreenError errorMessage="Nie udało się pobrać wyników." />

  if (userExam?.status === "not_enough_credits_error")
    return (
      <FullScreenError
        errorMessage="Nie wystarczająca ilość kredytów"
        actionButton={
          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/egzamin-praktyczny/${userExam.baseExam.code}`}
            >
              <Button
                onClick={async () => {
                  await updateStatus({
                    userExamId: userExamId,
                    newStatus: "user_pending",
                  })
                }}
              >
                Porwót do strony egzaminu
              </Button>
            </Link>
            <Link href={"/pricing"}>
              <Button>Zdobądź kredyty</Button>
            </Link>
          </div>
        }
      />
    )
  if (userExam?.status === "unknown_error_credits_refunded")
    return (
      <FullScreenError
        errorMessage="Wystąpił problem podczas sprawdzania twojego egzaminu"
        errorDetail="Nie martw się, twoje kredyty zostały zwrócone!"
        actionButton={
          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/egzamin-praktyczny/${userExam.baseExam.code}`}
            >
              <Button
                onClick={async () => {
                  await updateStatus({
                    userExamId: userExamId,
                    newStatus: "user_pending",
                  })
                }}
              >
                Powrót do strony egzaminu
              </Button>
            </Link>
          </div>
        }
      />
    )

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        {isPending && <MainContentLoading />}
        {!isPending &&
          (userExam?.status === "ai_pending" ||
            userExam?.status === "parsing_exam") && (
            <ExamLoadingScreen status={userExam.status} />
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
                customTitle="Twoje pliki"
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
