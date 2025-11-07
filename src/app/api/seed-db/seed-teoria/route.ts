import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { generateObject, type ModelMessage } from "ai"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { fetchMutation } from "convex/nextjs"
import type { WithoutSystemFields } from "convex/server"
import type { NextRequest } from "next/server"
import z from "zod/v4"
import { APP_CONFIG } from "~/APP_CONFIG"
import { env } from "~/env"

export const config = {
  api: {
    bodyParser: false,
  },
}
export async function POST(request: NextRequest) {
  const requestData = await request.formData()

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${env.AI_GATEWAY_API_KEY}`) {
    throw new Error("Unauthorized")
  }

  const contentPdf: File | null = requestData.get(
    "contentPdf",
  ) as unknown as File

  const ratingPdf: File | null = requestData.get("ratingPdf") as unknown as File

  const qualificationId = requestData.get("qualificationId") as string

  const year = requestData.get("year") as string

  const month = requestData.get("month") as string

  console.log(contentPdf)
  console.log(ratingPdf)
  console.log(qualificationId)
  console.log(year)
  console.log(month)

  if (!ratingPdf || !contentPdf || !qualificationId || !month || !year) {
    console.error("Some data missing")

    console.log(contentPdf)
    console.log(ratingPdf)
    console.log(qualificationId)
    console.log(year)
    console.log(month)
    throw new Error("Failed to do request")
  }

  const contentPdfBuffer = await contentPdf.arrayBuffer()
  const ratingPdfBuffer = await ratingPdf.arrayBuffer()

  const input: TeoriaInput[] = [
    {
      qualificationId: qualificationId,
      year: parseInt(year),
      month: month,
      contentPdf: contentPdfBuffer,
      ratingPdf: ratingPdfBuffer,
    },
  ]

  const promises = input.map(async (item) => {
    const readyData = await parsePdfWithAi(item)
    return readyData
  })

  const data = await Promise.all(promises)
  const flatMappedData = data.flatMap((a) => a)

  await insertData(flatMappedData)

  return new Response("Hello, World!")
}

export async function parsePdfWithAi({
  contentPdf,
  ratingPdf,
  qualificationId,
  year,
  month,
}: TeoriaInput) {
  console.log("Start main func")

  console.log("file read done")

  const mess: ModelMessage[] = [
    {
      role: "user",
      content: [
        {
          type: "file",
          data: contentPdf,
          mediaType: "application/pdf",
        },
        {
          type: "file",
          data: ratingPdf,
          mediaType: "application/pdf",
        },
      ],
    },
  ]
  console.log("messages created")

  console.log("starting generation")
  const codeFormattingPrompt = `If any part of the text is code, please enclose it in **Markdown code blocks** using triple backticks (\`\`\`) and specify the language (e.g., typescript, javascript). For example:
\`\`\`typescript
// code goes here 
const x: number = 5;
\`\`\``

  const { object, response } = await generateObject({
    model: APP_CONFIG.practicalExamRating.model,
    system: `Your only job is to take files as input, read them, and genereate an object that contains info from the file and that matches the schema im providing to you. You are going to be provided with two files, one is for the exam content, the questions and details, other one is the pdf that tells you how to rate the exam, it contains list answers to the questions.  
Exam content guidelines:
    - skip all the nonsense that is not relevant to the exam objectives (example. "Instrukcja dla zdającego" section is useless, or the metadata that student is required to input at real exam like 'PESEL' or personal data)
    - skip the paragraphs that describe the images inside the question content.
    - if you see any images inside skip them, dont recreate them, just skip them. Keep the question content as it is, it will be referencing the images but dont worry i will handle that. Do not try to recrate any images with md tables or anything, just skip the image and continue with exam objectives.
    - focus on the exam questions only, any text that is not relevant for student while taking the exam should be skipped
    - ${codeFormattingPrompt}, but if the question shows some code next to any image, skip it. Only include the code in question content if there is no confusing images next to it.

    Exam rating data table guidelines:
    - table has answers to every question, you have to just mark an answer object as correct or not,  The schema will tell you everything you need to get
    `,
    schema,
    messages: mess,
  })

  console.log("generation done")
  console.dir(object, { depth: null })

  const readyData = object.map((question) => {
    return {
      content: question.content,
      tags: question.tags,
      year,
      month,
      qualificationId,
      answers: question.answers,
    } as ReadyQuestionWithAnswers
  })
  return readyData
}

async function insertData(data: ReadyQuestionWithAnswers[]) {
  await fetchMutation(
    api.seed.insertDataTeoria,
    { dataProp: data },
    { token: await convexAuthNextjsToken() },
  )
}

export type TeoriaInput = {
  // contentPdf: string
  // ratingPdf: string
  contentPdf: ArrayBuffer
  ratingPdf: ArrayBuffer
  qualificationId: string
  year: number
  month: string
}

export type ReadyQuestionWithAnswers = WithoutSystemFields<Doc<"questions">> & {
  answers: z.infer<typeof answer>[]
}

export type TeoriaSchema = z.infer<typeof schema>

const answer = z.object({
  content: z
    .string()
    .describe(
      "The content of the answer, the actual text, leave empty string if no text found.",
    ),
  isCorrect: z
    .boolean()
    .describe(
      "Boolean that tells if the answer is correct. You have to find this information from the ratingPdf.",
    ),
  label: z
    .string()
    .max(1)
    .describe(
      "The answer label is the symbol next to a content. it can be one of these: 'A', 'B', 'C','D'",
    ),
})

const question = z.object({
  content: z
    .string()
    .describe("This holds the actual question content, what is being asked"),
  tags: z
    .optional(z.array(z.string()).max(5))
    .describe(
      "This property holds an array of tags. Tag is a string you have to generate based on the question content, max is 5 tags. All of them have to somehow describe the question, its for better filtering later. If you cant come up with 5 relevant tags insert as many as you came up with, remember i they have to be relevant to the topic of the question, dont be scared to put less that 4. All the tag has to be capital cased, like this: 'HTML'. For example if question talks about some web dev stuff you can put tags like 'HTML', 'JS', 'CSS', only if the question mentions those technologies. Dont add non relevant tags. All tags should be in Polish langugae and by pretty short, <=20 characters long",
    ),
  answers: z.array(answer).max(4).describe("List of questions answers"),
})

const schema = z.array(question)
