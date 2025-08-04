import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { MessageCircle, Trash } from "lucide-react";
import Link from "next/link";
import type { MyUIMessage } from "~/app/api/chat/route";
import SemanticDate from "~/components/semantic-date";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function ThreadCard({ item }: { item: Doc<"explanations"> }) {
  const messages = parseContent(item.content);
  const deleteChat = useMutation(api.ai_wyjasnia.mutate.deleteChat);

  return (
    <Link
      href={`/dashboard/ai-wyjasnia/chat/${item._id}`}
      className="w-1/2"
      prefetch={true}
    >
      <Card className="group hover:shadow-primary/10 hover:border-primary/200 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg">
        <CardContent className="px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="group-hover:text-primary line-clamp-2 overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap transition-colors duration-200">
                {messages[0]?.parts[0]?.type == "text"
                  ? messages[0]?.parts[0]?.text
                  : ""}
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

            <Button
              variant={"outline"}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await deleteChat({ chatId: item._id });
              }}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
function parseContent(content: string) {
  try {
    const parsed: MyUIMessage[] = JSON.parse(content);
    return parsed;
  } catch (error) {
    return [];
  }
}
