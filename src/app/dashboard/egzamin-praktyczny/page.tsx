"use client";

import { usePaginatedQuery } from "convex-helpers/react/cache";
import { api } from "convex/_generated/api";
import { type PaginatedQueryItem } from "convex/react";
import _ from "lodash";
import FullScreenError from "~/components/full-screen-error";
import ExamGroup from "~/components/praktyka/exam-group";
import PracticalExamsFilters from "~/components/praktyka/filters";
import PracticalExamHeader from "~/components/praktyka/header";
import LoadMoreButton from "~/components/praktyka/load-more";
import ExamPageSkeleton, { LoadingMore } from "~/components/praktyka/loadings";

export type ConvertedExams = {
  qualificationId: string;
  count: number;
  exams: PaginatedQueryItem<typeof api.praktyka.query.listPracticalExams>[];
};

export default function PraktykaPage() {
  const {
    results: exams,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.praktyka.query.listPracticalExams,
    {},
    { initialNumItems: 1 },
  );

  if (!exams) return <FullScreenError />;
  if (status === "LoadingFirstPage") return <ExamPageSkeleton />;

  function convertExams() {
    const grouped = _.groupBy(exams, "qualificationId");
    console.log("lodash client - ", grouped);
    return Object.entries(grouped).map(([qualificationId, examsInGroup]) => ({
      qualificationId: qualificationId,
      count: examsInGroup.length,
      exams: examsInGroup,
    }));
  }

  return (
    <>
      <div className="min-h-screen">
        <PracticalExamHeader />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PracticalExamsFilters />

          <div className="flex flex-col gap-4">
            {convertExams().map((group) => (
              <ExamGroup key={group.qualificationId} group={group} />
            ))}
          </div>
          <LoadingMore isLoading={status === "LoadingMore"} />
          <LoadMoreButton
            onClick={() => loadMore(40)}
            canLoadMore={status === "CanLoadMore"}
          />
        </div>
      </div>
    </>
  );
}
