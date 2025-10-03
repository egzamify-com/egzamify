"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "convex/_generated/api"
import { List } from "lucide-react"
import Link from "next/link"
import FullScreenError from "~/components/full-screen-error"
import LoadMoreBtn from "~/components/load-more"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import UserExamCard from "~/components/praktyka/history/user-exam-card"
import { UserExamItemSkeleton } from "~/components/praktyka/loadings"
import { Button } from "~/components/ui/button"

const title = "Wykonane egzaminy praktyczne"
const description = "Twoje podejścia"

export default function Page() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.praktyka.query.listUserExams,
    {},
    { initialNumItems: 40 },
  )
  if (status === "LoadingFirstPage") {
    return (
      <PageHeaderWrapper isPending={true}>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <UserExamItemSkeleton key={index} />
          ))}
        </div>
      </PageHeaderWrapper>
    )
  }
  if (results.length === 0)
    return (
      <FullScreenError
        type="warning"
        errorMessage="Brak wyników"
        actionButton={
          <Link href="/dashboard/egzamin-praktyczny">
            <Button variant={"outline"}>
              <List />
              Browse exams
            </Button>
          </Link>
        }
      />
    )
  return (
    <PageHeaderWrapper {...{ title, description }}>
      <div className="flex flex-col gap-6">
        {results.map((userExam) => (
          <UserExamCard
            key={`user-exam-card-${userExam._id}`}
            userExam={userExam}
          />
        ))}
      </div>
      {status === "LoadingMore" && (
        <div className="flex flex-col gap-4 pt-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <UserExamItemSkeleton key={index} />
          ))}
        </div>
      )}
      <LoadMoreBtn
        canLoadMore={status === "CanLoadMore"}
        onClick={() => loadMore(50)}
      />
    </PageHeaderWrapper>
  )
}
