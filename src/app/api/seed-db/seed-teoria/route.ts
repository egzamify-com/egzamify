// import { CanvasFactory } from "pdf-parse/worker"
import "pdf-parse/worker"
import { CanvasFactory } from "pdf-parse/worker"
// Get the Node.js require function (useful in ESM modules for resolution)
// This is often needed in Next.js Server Components/Routes
// where 'require' isn't natively available, but `createRequire` is.
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { generateObject, type ModelMessage } from "ai"
import { asyncMap } from "convex-helpers"
import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { fetchMutation } from "convex/nextjs"
import type { WithoutSystemFields } from "convex/server"
import { fileTypeFromBuffer } from "file-type"
import type { NextRequest } from "next/server"
import { PDFParse } from "pdf-parse"
import z from "zod/v4"
import { APP_CONFIG } from "~/APP_CONFIG"
import { env } from "~/env"
import { getFileUrl } from "~/lib/utils"

export const config = {
  api: {
    bodyParser: false,
  },
}
type StorageId = Id<"_storage">

export async function POST(request: NextRequest) {
  console.log(await convexAuthNextjsToken())
  const requestData = await request.formData()

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${env.AI_GATEWAY_API_KEY}`) {
    throw new Error("Unauthorized")
  }

  const contentPdfParam = requestData.get("contentPdf") as string

  const ratingPdfParam = requestData.get("ratingPdf") as string

  console.log({ contentPdfParam })
  console.log({ ratingPdfParam })

  const contentPdf = getFileUrl(contentPdfParam as StorageId, "contentPdf.pdf")
  const ratingPdf = getFileUrl(ratingPdfParam as StorageId, "ratingPdf.pdf")

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

  const link = new URL(contentPdf.raw.href)
  const parser = new PDFParse({ url: link, CanvasFactory })
  const result = await parser.getImage()
  await parser.destroy()

  const imagesData = result.pages
    .map((page) => {
      return page.images
    })
    .flatMap((a) => a)

  const insertImages = await asyncMap(imagesData, async (image) => {
    const postUrl = await fetchMutation(
      api.praktyka.mutate.generateUploadUrl,
      {},
      {
        token: await convexAuthNextjsToken(),
      },
    )
    const buffer = Buffer.from(image.data.buffer)
    const typeResult = await fileTypeFromBuffer(buffer)

    const contentType = typeResult
      ? typeResult.mime
      : "application/octet-stream"

    const response = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: buffer as unknown as ArrayBuffer,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const { storageId } = await response.json()
    return {
      storageId: storageId as Id<"_storage">,
      base64Data: buffer.toString("base64"),
      contentType: contentType,
    }
  })

  console.log(insertImages)

  //
  const fileMessages: ModelMessage[] = insertImages.map((image) => {
    const url = getFileUrl(image.storageId, `image-${image.storageId}`)!.raw

    // Create a data URI for the LLM
    const dataUri = `data:${image.contentType};base64,${image.base64Data}`

    return {
      role: "user",
      content: [
        {
          type: "text",
          text: `Image Reference URL: ${url} \n (Use this URL if a question refers to this image)`,
        },
        {
          type: "image",
          image: dataUri,
        },
      ],
    }
  })

  const input: TeoriaInput = {
    qualificationId: qualificationId,
    year: parseInt(year),
    month: month,
    contentPdf: contentPdf.raw.href,
    ratingPdf: ratingPdf.raw.href,
    imageMessages: fileMessages,
  }
  console.log({ input })

  // const promises = input.map(async (item) => {
  //   const readyData = await parsePdfWithAi(item)
  //   return readyData
  // })

  const readyData = await parsePdfWithAi(input)

  await insertData(readyData)

  return new Response("Hello, World!")
}

export async function parsePdfWithAi({
  contentPdf,
  ratingPdf,
  qualificationId,
  year,
  month,
  imageMessages,
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
    ...imageMessages,
  ]

  console.log("messages created")
  console.dir(mess, { depth: null })

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
    - ${codeFormattingPrompt}, but if the question shows some code next to any image, skip it. Only include the code in question content if there is no confusing images next to it. DO NOT FORGET TO CORRECLTY FORAMT THE CODE AS CODE BLOCK.

    Exam rating data table guidelines:
    - table has answers to every question, you have to just mark an answer object as correct or not,  The schema will tell you everything you need to get
    `,
    schema,
    messages: mess,
  })

  console.log("generation done")
  console.dir(response, { depth: null })
  console.dir(object, { depth: null })

  const readyData = object.map((question) => {
    return {
      content: question.content,
      tags: question.tags,
      year,
      month,
      qualificationId,
      answers: question.answers,
      attachmentId: getStorageId(question.imageUrl),
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
  contentPdf: string
  ratingPdf: string
  qualificationId: string
  year: number
  month: string
  imageMessages: ModelMessage[]
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
  imageUrl: z
    .string()
    .optional()
    .describe(
      "This is the field to hold the possible image url. If you understand from the question context that question mentions an image, and tells student to answer the question based on this image, you have to look thru all the provided to you images, and set this field to the image URL orthe image. So all the images you will get are in URL form. If question doesnt require image skip this field. If it happends that image doesnt fit any question skip it.",
    ),
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

function getStorageId(url: string | undefined): Id<"_storage"> | undefined {
  if (!url) return undefined
  try {
    const id = new URL(url).searchParams.get("storageId")
    return id ? (id as Id<"_storage">) : undefined
  } catch {
    return undefined
  }
}
