import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function LoadingMoreThreads({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="w-1/2" key={index}>
          <Card className="group cursor-not-allowed transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
            <CardContent className="px-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Skeleton for the H3 title */}

                  <h3 className="text-base font-semibold">
                    <Skeleton className="mb-1 h-5 w-3/4" />{" "}
                    {/* Line 1 of title */}
                    <Skeleton className="h-5 w-1/2" /> {/* Line 2 of title */}
                  </h3>

                  <div className="mt-2 flex items-center gap-3 text-sm">
                    {/* Skeleton for the SemanticDate (icon + text) */}

                    <div className="flex items-center gap-1">
                      {/* Assuming SemanticDate has an icon, we'll mimic that */}
                      <Skeleton className="h-3 w-3 rounded-full" />{" "}
                      {/* Icon placeholder */}
                      <Skeleton className="h-3 w-20" />{" "}
                      {/* Date text placeholder */}
                    </div>

                    {/* Skeleton for messages count (icon + text) */}

                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-full" />{" "}
                      {/* MessageCircle icon placeholder */}
                      <Skeleton className="h-3 w-24" />{" "}
                      {/* Messages count text placeholder */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {/* Skeleton for the ChevronRight icon */}

                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
}
