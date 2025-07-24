"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";

const AI_MODES = APP_CONFIG.ai_wyjasnia.modes;
export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
  const updateThread = useMutation(
    api.ai_wyjasnia.mutate.updateAssistantAnnotations,
  );
  const deleteThread = useMutation(api.ai_wyjasnia.mutate.deleteChat);

  const [selectedMode, setSelectedMode] = useState<AiWyjasniaMode>("Normal");

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,
    body: {
      selectedMode,
      currentSystemPrompt: AI_MODES.find((m) => m.id === selectedMode)
        ?.systemPrompt,
    },

    async onFinish(message) {
      await updateThread({
        chatId: id as Id<"explanations">,
        newAnnotation: JSON.stringify(message.annotations),
      });
    },
  });
  // handle empty chats, delete if user left with no messages (useEffect and ref)
  const latestMessagesRef = useRef(messages);
  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      const currentMessages = latestMessagesRef.current;

      if (currentMessages.length === 0) {
        (async () => {
          await deleteThread({ chatId: id as Id<"explanations"> });
        })();
      }
    };
  }, [id, deleteThread]);
  return (
    <div className="mx-auto flex h-full w-[70%] flex-col items-center justify-between">
      <div className="w-full overflow-y-auto p-4">
        {initialMessages?.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          </div>
        ) : (
          initialMessages?.map((message: Message) => (
            <div
              key={message.id}
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
                  <div className="absolute top-[-35px] left-[5px]">
                    {message.role === "assistant" &&
                      parseAnnotations(message.annotations) && (
                        <Badge variant="outline">
                          {parseAnnotations(message.annotations)}
                        </Badge>
                      )}
                  </div>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-card sticky bottom-0 w-full space-y-4 rounded-t-xl border p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">AI Response Mode</Label>
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as AiWyjasniaMode)}
            className="flex flex-wrap gap-4"
          >
            {AI_MODES.map((mode) => (
              <div key={mode.id} className="flex items-center space-x-2">
                <RadioGroupItem value={mode.title} id={mode.id} />
                <Label htmlFor={mode.id} className="cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{mode.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {mode.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={`Type your message (${AI_MODES.find((m) => m.id === selectedMode)?.title} mode)...`}
            className="min-h-[20px] flex-1 whitespace-pre-wrap"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
function parseAnnotations(annotations: any) {
  if (!annotations) return null;
  // console.log("annotations", annotations[0].mode);
  return annotations[0].mode;
}
