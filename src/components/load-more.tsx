import { Download } from "lucide-react";
import { Button } from "./ui/button";

export default function LoadMoreBtn({
  onClick,
  canLoadMore,
  text,
}: {
  onClick: () => void;
  canLoadMore: boolean;
  text?: string;
}) {
  if (!canLoadMore) return null;
  if (canLoadMore) {
    return (
      <div className="mt-10 text-center">
        <Button variant="outline" size="lg" onClick={onClick}>
          <Download />
          {text ?? "Load more"}
        </Button>
      </div>
    );
  }
}
