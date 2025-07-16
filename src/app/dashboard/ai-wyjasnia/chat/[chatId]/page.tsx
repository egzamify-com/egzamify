import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import type { Message } from "ai";
import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Chat from "../../chat";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await props.params;
  console.log("chat id from page component - ", chatId);

  const result = await fetchQuery(
    api.ai_wyjasnia.queries.getThreadMessages,
    {
      chatId,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );
  console.log(result);
  if (!result[0]) {
    return;
  }
  try {
    const dbMessages: Message[] = JSON.parse(result[0].content);
    return <Chat id={chatId} initialMessages={dbMessages} />;
  } catch (error) {
    return <Chat id={chatId} initialMessages={[]} />;
  }
}
