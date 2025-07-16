import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { appendResponseMessages, type Message, streamText } from "ai";
import { api } from "convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { APP_CONFIG } from "~/APP_CONFIG";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id, currentSystemPrompt } = await req.json();

  console.log("systme prompt used - ", currentSystemPrompt);
  console.log("chat id inside route handler - ", id);

  const messagesForLLM: Message[] = [
    { role: "system", content: `${currentSystemPrompt}` },
    ...messages.filter((m: Message) => m.role !== "system"),
  ];

  const result = streamText({
    model: APP_CONFIG.ai_wyjasnia.model,
    maxTokens: APP_CONFIG.ai_wyjasnia.maxOutputTokens,
    messages: messagesForLLM,
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  return result.toDataStreamResponse({ sendReasoning: true });
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  console.log("id - ", id);
  console.log("content - ", content);
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
