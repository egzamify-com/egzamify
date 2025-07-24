import { Message } from "ai";
import { Doc } from "../_generated/dataModel";

export function parseThreadMessages(thread: Doc<"explanations">) {
  const dbMessages: Message[] = JSON.parse(thread.content);
  return dbMessages;
}
