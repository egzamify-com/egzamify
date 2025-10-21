"use client"

import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import type { ListPracticalExamsFilter } from "convex/praktyka/query"
import type { PaginatedQueryItem } from "convex/react"
import { Cpu, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ExamGroup from "~/components/egzamin-praktyczny/exam-group"
import PracticalExamsFilters from "~/components/egzamin-praktyczny/filters"
import EnhancedExamSkeleton, {
  LoadingMore,
} from "~/components/egzamin-praktyczny/loadings"
import LoadMoreBtn from "~/components/load-more"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

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
    { initialNumItems: 40 },
  )

  return (
    <PageHeaderWrapper
      title="Egzamin praktyczny"
      description="Przeglądaj dostępne egzaminy praktyczne. Prześlij swoją pracę, błyskawicznie otrzymaj wyniki."
      icon={<Cpu size={pageHeaderWrapperIconSize} />}
      isPending={status === "LoadingFirstPage"}
    >
      <PracticalExamsFilters
        {...{ setSearchInput, setSelectedQualificationId, setSelectedSort }}
      />
      {status === "LoadingFirstPage" && <EnhancedExamSkeleton />}
      {qualifications.length === 0 && (
        <p className="text-muted-foreground">Brak wyników.</p>
      )}
      <SavedQualifications />
      <RenderQualifications qualifications={qualifications} />
      <LoadingMore isLoading={status === "LoadingMore"} />
      <LoadMoreBtn
        onClick={() => loadMore(40)}
        canLoadMore={status === "CanLoadMore"}
      />
    </PageHeaderWrapper>
  )
}
function RenderQualifications({
  qualifications,
}: {
  qualifications: PaginatedQueryItem<
    typeof api.praktyka.query.listPracticalExams
  >[]
}) {
  return (
    <div className="flex flex-col gap-4">
      {qualifications.length > 0 &&
        qualifications.map((exams) => (
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
  )
}
function SavedQualifications() {
  const { data } = useQuery(api.praktyka.query.listSavedQualificationsWithExams)

  return (
    <Card className="mb-4 gap-2 border-1">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-start gap-2">
          <Star color="yellow" fill="yellow" />{" "}
          <p className="text-lg">Twoje kwalifikacje</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <RenderQualifications qualifications={data} />
        ) : (
          <div>
            <p>Brak zapisanych kwalifikacji.</p>
            <p className="text-muted-foreground">
              Przejdź do{" "}
              <Link href={"/dashboard/settings"} className="underline">
                Ustawień
              </Link>
              , aby dodać kwalifikację zgodne z twoim kierunkiem.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
