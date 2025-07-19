import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import type { Message } from "ai";
import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Chat from "../../chat";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await props.params;

  const result = await fetchQuery(
    api.ai_wyjasnia.query.getThreadMessages,
    {
      chatId,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );
  console.log("result from page ", result);
  if (!result[0]) {
    return <Chat id={chatId} initialMessages={[]} />;
  }
  try {
    const dbMessages: Message[] = JSON.parse(result[0].content);
    return <Chat id={chatId} initialMessages={dbMessages} />;
  } catch (error) {
    return <Chat id={chatId} initialMessages={[]} />;
  }
}
