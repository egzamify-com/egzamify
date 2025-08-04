import { type MyUIMessage } from "../../src/app/api/chat/route";
import { type Doc } from "../_generated/dataModel";
export function parseThreadMessages(thread: Doc<"explanations">) {
  const dbMessages: MyUIMessage[] = JSON.parse(thread.content);
  return dbMessages;
}
