import { groq } from "@ai-sdk/groq";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { appendResponseMessages, type Message, streamText } from "ai";
import { api } from "convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  console.log("chat id inside route handler - ", id);
  const result = streamText({
    // system: ""
    model: groq("llama-3.1-8b-instant"),
    messages,
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
