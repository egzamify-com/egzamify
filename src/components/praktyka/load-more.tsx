import { Button } from "../ui/button";

export default function LoadMoreButton({
  onClick,
  canLoadMore,
}: {
  onClick: () => void;
  canLoadMore: boolean;
}) {
  return (
    <>
      {canLoadMore && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={onClick}>
            Load More Exams
          </Button>
        </div>
      )}
    </>
  );
}
