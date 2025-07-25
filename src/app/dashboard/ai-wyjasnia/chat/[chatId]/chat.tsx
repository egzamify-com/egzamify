"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG";
import ChatMessages from "~/components/ai-wyjasnia/chat-messages";
import NoMessages from "~/components/ai-wyjasnia/no-messages-info";
import ChatInput from "../../../../../components/ai-wyjasnia/chat-input";

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
      currentSystemPrompt: APP_CONFIG.ai_wyjasnia.modes.find(
        (m) => m.id === selectedMode,
      )?.systemPrompt,
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
    // scroll to latest message on bottom
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
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
        {messages?.length === 0 ? (
          <NoMessages />
        ) : (
          <ChatMessages {...{ messages }} />
        )}
      </div>
      <ChatInput
        {...{
          input,
          handleInputChange,
          handleSubmit,
          selectedMode,
          onValueChange: (value) => setSelectedMode(value as AiWyjasniaMode),
        }}
      />
    </div>
  );
}
