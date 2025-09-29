"use client";

import { usePaginatedQuery } from "convex-helpers/react/cache";
import { api } from "convex/_generated/api";
import { type PaginatedQueryItem } from "convex/react";
import _ from "lodash";
import { ErrorBoundary } from "react-error-boundary";
import FullScreenError from "~/components/full-screen-error";
import LoadMoreBtn from "~/components/load-more";
import PageHeaderWrapper from "~/components/page-header-wrapper";
import ExamGroup from "~/components/praktyka/exam-group";
import PracticalExamsFilters from "~/components/praktyka/filters";
import ExamPageSkeleton, { LoadingMore } from "~/components/praktyka/loadings";
import { Button } from "~/components/ui/button";
export type ConvertedExams = {
  qualificationId: string;
  count: number;
  exams: PaginatedQueryItem<typeof api.praktyka.query.listPracticalExams>[];
};
export default function Page() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <FullScreenError
            errorDetail={error.message}
            errorMessage="Failed to load exams"
            actionButton={<Button onClick={resetErrorBoundary}>Retry</Button>}
          />
        );
      }}
    >
      <PraktykaPage />
    </ErrorBoundary>
  );
}
function PraktykaPage() {
  const {
    results: exams,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.praktyka.query.listPracticalExams,
    {},
    { initialNumItems: 40 },
  );

  if (status === "LoadingFirstPage") return <ExamPageSkeleton />;
  if (exams.length === 0)
    return <FullScreenError type="warning" errorMessage="No exams found" />;

  function convertExams() {
    const grouped = _.groupBy(exams, "qualificationId");
    return Object.entries(grouped).map(([qualificationId, examsInGroup]) => ({
      qualificationId: qualificationId,
      count: examsInGroup.length,
      exams: examsInGroup,
    }));
  }

  return (
    <PageHeaderWrapper
      title="Available Exams"
      description="Choose from our comprehensive exam catalog"
    >
      <PracticalExamsFilters />
      <div className="flex flex-col gap-4">
        {convertExams().map((group) => (
          <ExamGroup key={group.qualificationId} group={group} />
        ))}
      </div>
      <LoadingMore isLoading={status === "LoadingMore"} />
      <LoadMoreBtn
        onClick={() => loadMore(40)}
        canLoadMore={status === "CanLoadMore"}
      />
    </PageHeaderWrapper>
  );
}
