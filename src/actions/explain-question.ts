"use server"

import { generateText, type ModelMessage } from "ai"
import type { Doc } from "convex/_generated/dataModel"
import type { QuizAnswersType } from "convex/pvp_quiz/helpers"
import { APP_CONFIG } from "~/APP_CONFIG"
import { getFileUrl } from "~/lib/utils"
import { chargeCredits, refundCredits } from "./actions"

export async function explainQuestion(
  question: Doc<"questions">,
  answers: QuizAnswersType[],
) {
  console.log(`Requested explanation for question - ${question._id}`)

  console.log("got to delay")

  const gotCharged = await chargeCredits(APP_CONFIG.questionExplanation.price)
  console.log("got past charging")
  if (!gotCharged) {
    const errMess = "Nie posiadasz wystarczająco dużo kredytów!"
    console.error(errMess)
    throw new Error(errMess)
  }

  console.log("charged user successfullyy")

  const readyAnswers = answers.map(
    (answer) =>
      `${answer.label}, ${answer.content}, ${answer.isCorrect ? "Poprawne" : ""}`,
  )
  console.log("created answers")

  const messages: ModelMessage[] = [
    {
      role: "system",
      content: APP_CONFIG.questionExplanation.system,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `
      <pytanie do wyjasnienia>
      ${question.content}
      </pytanie do wyjasnienia>

      <odpowiedzi> 
      ${readyAnswers[0]}
      ${readyAnswers[1]}
      ${readyAnswers[2]}
      ${readyAnswers[3]}
      </odpowiedzi>
          `,
        },
      ],
    },
  ]
  console.log("created messages")

  if (question.attachmentId) {
    console.log(
      "question has a image so got to the appending message with file url",
    )
    const questionAttachment = getFileUrl(
      question.attachmentId,
      "Zdjęcie do pytania",
    )
    console.log("got the url")

    if (questionAttachment) {
      console.log("pushing item to messages")
      messages.push({
        role: "user",
        content: [
          {
            type: "image",
            image: questionAttachment.raw,
          },
        ],
      })
      console.log("pushed new message")
    }
  }

  console.dir(messages, { depth: null })
  try {
    console.log("starting ai gen")
    const aiResponse = await generateText({
      model: APP_CONFIG.questionExplanation.model,
      maxOutputTokens: 1000,
      messages,
    })
    console.log("ai gen completed")
    console.dir(aiResponse, { depth: null })
    return aiResponse.text.toString()
  } catch (e) {
    console.error(
      `Something went wrong with explaining question - ${question._id}, refunding credits`,
    )
    console.error(e)
    await refundCredits(APP_CONFIG.questionExplanation.price)
    throw new Error("Cos poszlo nie tak")
  }
}
