import { Bot } from "lucide-react"
import Markdown from "marked-react"
import type { MyUIMessage } from "~/app/api/chat/route"
import { Card, CardContent } from "../ui/card"
import ActivityStatusAvatar from "../users/activity-status-avatar"
import MessageModeAndActionBtns from "./message-mode"

export default function ChatMessages({
  messages,
}: {
  messages: MyUIMessage[]
}) {
  return (
    <div className="pt-10">
      {messages?.map((message) => (
        <ChatMessage
          key={`chat-message-key-${crypto.randomUUID()}`}
          {...{ message }}
        />
      ))}
    </div>
  )
}

function ChatMessage({ message }: { message: MyUIMessage }) {
  return (
    <div
      className={`my-3 flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[50%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full`}
        >
          {message.role === "user" ? (
            <ActivityStatusAvatar />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <Card className={`relative flex items-center justify-center py-2`}>
          <MessageModeAndActionBtns
            {...{
              message,
            }}
          />
          <CardContent>
            <div className="text-sm whitespace-pre-wrap">
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <div
                    key={index}
                    className="prose prose-md dark:prose-invert max-w-none"
                  >
                    <Markdown>
                      {removeMetadataFromMessageString(part.text)}
                    </Markdown>
                  </div>
                ) : null,
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
function removeMetadataFromMessageString(inputString: string): string {
  // The regex now includes \s to match the space before "Mode".
  const regex = /\sMode.*$/i

  // Replace the matched part with an empty string.
  return inputString.replace(regex, "")
}
