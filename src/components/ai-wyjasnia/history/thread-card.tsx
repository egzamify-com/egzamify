import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { motion } from "framer-motion"
import { MessageCircle, Trash } from "lucide-react"
import Link from "next/link"
import type { MyUIMessage } from "~/app/api/chat/route"
import SemanticDate from "~/components/semantic-date"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
export default function ThreadCard({ item }: { item: Doc<"explanations"> }) {
  const messages = parseContent(item.content)
  const deleteChat = useMutation(api.ai_wyjasnia.mutate.deleteChat)

  return (
    <Link
      href={`/dashboard/ai-wyjasnia/chat/${item._id}`}
      className="w-1/2"
      prefetch={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group hover:border-primary border-border cursor-pointer gap-0 transition-all duration-300">
          <CardHeader>
            <CardTitle>
              <h3 className="line-clamp-2 overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap transition-colors">
                {messages[0]?.parts[0]?.type == "text"
                  ? messages[0]?.parts[0]?.text
                  : ""}
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex flex-row justify-between">
            <div className="relative flex flex-row items-start justify-start gap-3">
              <div className="text-muted-foreground flex items-center gap-3 text-sm">
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
            <div className="absolute -top-10 right-4 flex h-full flex-col items-start justify-start">
              <Button
                variant={"outline"}
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  await deleteChat({ chatId: item._id })
                }}
              >
                <Trash className="text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
function parseContent(content: string) {
  try {
    const parsed: MyUIMessage[] = JSON.parse(content)
    return parsed
  } catch (error) {
    return []
  }
}
