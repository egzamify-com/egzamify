import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import {
  appendResponseMessages,
  createDataStreamResponse,
  type Message,
  streamText,
} from "ai";
import { api } from "convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { APP_CONFIG } from "~/APP_CONFIG";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body", body);
  const { messages, id, currentSystemPrompt, selectedMode } = body;

  const messagesForLLM: Message[] = [
    { role: "system", content: `${currentSystemPrompt}` },
    ...messages.filter((m: Message) => m.role !== "system"),
  ];

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData("initialized call");

      const result = streamText({
        model: APP_CONFIG.ai_wyjasnia.model,
        maxTokens: APP_CONFIG.ai_wyjasnia.maxOutputTokens,
        messages: messagesForLLM,

        async onFinish({ response }) {
          dataStream.writeMessageAnnotation({
            id,
            mode: `${selectedMode}`,
          });
          console.log("responses mess - ", response.messages);
          await saveChat({
            id,
            messages: appendResponseMessages({
              messages,
              responseMessages: response.messages,
            }),
          });
          dataStream.writeData("call completed");
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      return error instanceof Error ? error.message : String(error);
    },
  });
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  // console.log("id - ", id);
  console.log("content going into db - ", content);
  const token = await convexAuthNextjsToken();
  try {
    const a = await fetchMutation(
      api.ai_wyjasnia.mutate.storeChatMessages,
      {
        chatId: id,
        newContent: content,
      },
      {
        token,
      },
    );
    console.log("result from stroing messages- ", a);
  } catch (error) {}
}
