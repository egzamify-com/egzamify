"use client";
import type { Message } from "ai";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQueryWithStatus } from "convex/helpers";
import { ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import SemanticDate from "~/components/semantic-date";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

type Item = {
  _id: Id<"explanations">;
  _creationTime: number;
  user_id: Id<"users">;
  chatId: string;
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
  const {
    isPending,
    data: history,
    error,
  } = useQueryWithStatus(api.ai_wyjasnia.queries.getAiResponsesHistory);

  if (isPending) {
    return <LoadingHistory />;
  }

  if (error || !history) {
    return <NoHistory />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-5 bg-gradient-to-br p-4">
      {history.map((item) => (
        <ThreadComponent key={item._id} item={item} />
      ))}
    </div>
  );
}
function ThreadComponent({ item }: { item: Item }) {
  const messages = parseContent(item.content);

  return (
    <Link href={`/dashboard/ai-wyjasnia/chat/${item._id}`} className="w-1/2">
      <Card className="group hover:shadow-primary/10 hover:border-primary/20 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
        <CardContent className="px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="group-hover:text-primary line-clamp-2 text-base font-semibold transition-colors duration-200">
                jfkdlsjfdlk
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
function parseContent(content: string) {
  try {
    const parsed: Message[] = JSON.parse(content);
    return parsed;
  } catch (error) {
    return [];
  }
}
