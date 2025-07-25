import type { Message } from "ai";
import { Bot, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import MessageMode from "./message-mode";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return messages?.map((message: Message) => (
    <ChatMessage key={message.id} {...{ message }} />
  ));
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={`my-3 flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[50%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {message.role === "user" ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <Card
          className={`relative flex items-center justify-center py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}
        >
          <MessageMode {...{ message }} />
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
