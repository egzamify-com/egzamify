"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "convex/_generated/api"
import type { ListPracticalExamsFilter } from "convex/praktyka/query"
import { useState } from "react"
import LoadMoreBtn from "~/components/load-more"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import ExamGroup from "~/components/praktyka/exam-group"
import PracticalExamsFilters from "~/components/praktyka/filters"
import EnhancedExamSkeleton, {
  LoadingMore,
} from "~/components/praktyka/loadings"

export default function PraktykaPage() {
  const [searchInput, setSearchInput] = useState<string>("")
  const [selectedQualificationId, setSelectedQualificationId] =
    useState<ListPracticalExamsFilter["qualificationId"]>("wszystkie")
  const [selectedSort, setSelectedSort] =
    useState<ListPracticalExamsFilter["sort"]>("asc")
  const {
    results: qualifications,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.praktyka.query.listPracticalExams,
    {
      filters: {
        qualificationId: selectedQualificationId,
        search: searchInput,
        sort: selectedSort,
      },
    },
    { initialNumItems: 1 },
  )

  return (
    <PageHeaderWrapper
      title="Egzamin praktyczny"
      description="Przeglądaj dostępne egzaminy praktyczne. Prześlij swoją pracę, błyskawicznie otrzymaj wyniki."
    >
      <PracticalExamsFilters
        {...{ setSearchInput, setSelectedQualificationId, setSelectedSort }}
      />
      {status === "LoadingFirstPage" && <EnhancedExamSkeleton />}
      {qualifications.length === 0 && (
        <p className="text-muted-foreground">Brak wyników.</p>
      )}
      {qualifications.length > 0 && (
        <div className="flex flex-col gap-4">
          {qualifications.map((exams) => (
            <ExamGroup
              key={crypto.randomUUID()}
              group={{
                exams: exams.baseExams.map((exam) => {
                  return {
                    ...exam,
                    qualification: exams.qualification,
                  }
                }),
                count: exams.baseExams.length,
                qualificationId: exams.qualification._id,
              }}
            />
          ))}
        </div>
      )}
      <LoadingMore isLoading={status === "LoadingMore"} />
      <LoadMoreBtn
        onClick={() => loadMore(40)}
        canLoadMore={status === "CanLoadMore"}
      />
    </PageHeaderWrapper>
  )
}
