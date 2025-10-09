import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { api } from "convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { chargeCredits, refundCredits } from "~/actions/actions"
import { APP_CONFIG } from "~/APP_CONFIG"

type MyMessageMetadata = {
  mode: string
  createdAt: number
}

export type MyUIMessage = UIMessage<MyMessageMetadata>

export const maxDuration = 30

export async function POST(req: Request) {
  const body = await req.json()
  console.dir(body, { depth: null })
  const { messages, id } = body

  const gotCharged = await chargeCredits(
    APP_CONFIG.ai_wyjasnia.creditPricePerMessage,
  )
  if (!gotCharged) {
    throw new Error("Not enough credits")
  }
  console.dir(messages, { depth: null })
  console.dir(convertToModelMessages(messages as MyUIMessage[], {}), {
    depth: null,
  })
  try {
    const result = streamText({
      model: APP_CONFIG.ai_wyjasnia.model,
      system: APP_CONFIG.ai_wyjasnia.system,
      maxOutputTokens: APP_CONFIG.ai_wyjasnia.maxOutputTokens,
      messages: convertToModelMessages(
        toMessagesWithModeInContent(messages as MyUIMessage[]),
      ),
    })
    return result.toUIMessageStreamResponse<MyUIMessage>({
      originalMessages: messages as MyUIMessage[],
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return {
            createdAt: Date.now(),
            mode: messages[messages.length - 1].metadata.mode,
          }
        }
      },
      onFinish: async ({ messages }) => {
        console.log(await result.totalUsage)
        console.log(await result.finishReason)
        saveChat({
          id: id as string,
          messages: toOriginalMessagesWithoutMode(messages) as MyUIMessage[],
        })
      },
    })
  } catch (e) {
    console.log("Error while generating response in ai chat, refunding credits")
    await refundCredits(APP_CONFIG.ai_wyjasnia.creditPricePerMessage)
  }
}
export async function saveChat({
  id,
  messages,
}: {
  id: string
  messages: MyUIMessage[]
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2)
  // console.log("id - ", id);
  console.log("content going into db - ", content)
  const token = await convexAuthNextjsToken()
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
    )
    console.log("result from stroing messages- ", a)
  } catch {}
}
function toMessagesWithModeInContent(
  originalMessages: MyUIMessage[],
): MyUIMessage[] {
  const messes = originalMessages.map((mess) => {
    const newContent =
      mess.parts[0]?.type === "text"
        ? (mess.parts[0].text = `MODE=${mess.metadata?.mode ?? "Normal"} USER-MESSAGE=${mess.parts[0]?.text ?? ""}`)
        : ""

    const a = {
      ...mess,
    }
    if (a.parts[0]?.type === "text") {
      a.parts[0].text = newContent
    }
    console.log("a - ", a)
    return a
  })
  return messes
}
function toOriginalMessagesWithoutMode(modifiedMessages: MyUIMessage[]) {
  return modifiedMessages.map((message) => {
    if (message.parts[0]?.type === "text") {
      const originalText = message.parts[0].text

      const regex = /USER-MESSAGE=(.*)/
      const match = regex.exec(originalText)

      const userMessage = match ? (match[1] ?? "") : null

      const newMessage = {
        ...message,
        parts: [
          {
            type: "text",
            text: userMessage,
          },
        ],
        metadata: {
          // You might need to add logic here to extract the original mode
          // if you want to preserve it. For now, we'll just set it to 'Normal'
          // as in your original function.
          mode: "Normal",
        },
      }

      return newMessage
    }

    // If it's not a text message, return it as is.
    return { ...message }
  })
}
