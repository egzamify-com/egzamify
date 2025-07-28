"use client";

import { api } from "convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import FullScreenError from "~/components/full-screen-error";
import ExamItem from "~/components/praktyka/ExamItem";
import { Button } from "~/components/ui/button";

export default function PraktykaPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.praktyka.query.listPracticalExams,
    {},
    { initialNumItems: 1 },
  );
  if (!results) return <FullScreenError />;
  if (status === "LoadingFirstPage") return <div>Loading first page...</div>;
  return (
    <>
      {results.map((exam) => (
        <ExamItem key={exam._id} exam={exam} />
      ))}
      {status === "LoadingMore" && <div>Loading more...</div>}
      {status === "CanLoadMore" && (
        <Button onClick={() => loadMore(1)}>Load More</Button>
      )}
    </>
  );
}
