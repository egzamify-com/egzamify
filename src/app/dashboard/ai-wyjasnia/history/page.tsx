"use client";
import type { Message } from "ai";
import { usePaginatedQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { ChevronRight, Download, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import SemanticDate from "~/components/semantic-date";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

type Item = {
  _id: Id<"explanations">;
  _creationTime: number;
  user_id: Id<"users">;
  content: string;
};

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HistoryPage />
      </Suspense>
    </>
  );
}
export function HistoryPage() {
  // const {
  //   isPending,
  //   data: history,
  //   error,
  // } = useQueryWithStatus(api.ai_wyjasnia.queries.getAiResponsesHistory);

  const {
    isLoading,
    loadMore,
    results: history,
    status,
  } = usePaginatedQuery(
    api.ai_wyjasnia.queries.getAiResponsesHistory,
    {},
    { initialNumItems: 40 },
  );

  if (status === "LoadingFirstPage") {
    return <LoadingHistory />;
  }

  if (!history) {
    return <NoHistory />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5 bg-gradient-to-br p-4">
      {history.map((item) => (
        <ThreadComponent key={item._id} item={item} />
      ))}
      {status == "LoadingMore" && <LoadingMoreThreads count={40} />}
      <Button onClick={() => loadMore(1)} disabled={status !== "CanLoadMore"}>
        <Download />
        Load More
      </Button>
    </div>
  );
}
function ThreadComponent({ item }: { item: Item }) {
  const messages = parseContent(item.content);

  return (
    <Link
      href={`/dashboard/ai-wyjasnia/chat/${item._id}`}
      className="w-1/2"
      prefetch={true}
    >
      <Card className="group hover:shadow-primary/10 hover:border-primary/200 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
        <CardContent className="px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="group-hover:text-primary line-clamp-2 overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap transition-colors duration-200">
                {messages[0] ? (
                  <>{`${messages[0].content}...`}</>
                ) : (
                  <p className="text-muted-foreground">No messages yet</p>
                )}
              </h3>

              <div className="text-muted-foreground mt-2 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <SemanticDate date={item._creationTime} withIcon />
                </div>

                {messages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{messages.length} messages</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function NoHistory() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      {"You didn't create any chats yet."}
      <Link href={`/dashboard/ai-wyjasnia`}>
        <Button>Start new chat</Button>
      </Link>
    </div>
  );
}
function LoadingHistory() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <SpinnerLoading />
      <h1 className="text-2xl font-bold">{"Loading chat history..."}</h1>
    </div>
  );
}
export function LoadingMoreThreads({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="w-1/2" key={index}>
          <Card className="group hover:shadow-primary/10 hover:border-primary/200 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
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
function parseContent(content: string) {
  try {
    const parsed: Message[] = JSON.parse(content);
    return parsed;
  } catch (error) {
    return [];
  }
}
