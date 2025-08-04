import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { api } from "convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG";

type MyMessageMetadata = {
  mode: AiWyjasniaMode;
  createdAt: number;
};

export type MyUIMessage = UIMessage<MyMessageMetadata>;

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.dir(body, { depth: null });
  const { messages, id } = body;

  const result = streamText({
    model: APP_CONFIG.ai_wyjasnia.model,
    maxOutputTokens: APP_CONFIG.ai_wyjasnia.maxOutputTokens,
    messages: convertToModelMessages(messages as UIMessage[]),
  });
  return result.toUIMessageStreamResponse<MyUIMessage>({
    originalMessages: messages as MyUIMessage[],
    messageMetadata: ({ part }) => {
      if (part.type === "start") {
        return {
          createdAt: Date.now(),
          mode: messages[messages.length - 1].metadata.mode,
        };
      }
    },
    onFinish: ({ messages }) => {
      saveChat({ id: id as string, messages });
    },
  });
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: UIMessage[];
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
