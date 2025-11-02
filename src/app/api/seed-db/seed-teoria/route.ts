import { generateObject, type ModelMessage } from "ai"
import { readFile } from "fs/promises"
import z from "zod/v4"
import { APP_CONFIG } from "~/APP_CONFIG"

export async function GET() {
  return new Response("Hello, World!")
}

export type TeoriaInput = {
  contentPdf: string
  ratingPdf: string
  qualificationId: string
}

const answer = z.object({
  content: z.optional(
    z
      .string()
      .describe(
        "The content of the answer, the actual text, leave null if no text found.",
      ),
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
      "This property holds an array of tags. Tag is a string you have to generate based on the question content, max is 5 tags. All of them have to somehow describe the question, its for better filtering later. If you cant come up with 5 relevant tags insert as many as you came up with, remember i they have to be relevant to the topic of the question, dont be scared to put less that 5. All the tag has to be capital cased, like this: 'HTML'. For example if question talks about some web dev stuff you can put tags like 'HTML', 'JS', 'CSS', only if the question mentions those technologies.",
    ),
  answers: z.array(answer).max(4).describe("List of questions answers"),
})

const schema = z.array(question)

export async function parsePdfWithAi({ contentPdf, ratingPdf }: TeoriaInput) {
  console.log("Start main func")

  const contentFile = await readFile(contentPdf)
  const ratingFile = await readFile(ratingPdf)
  console.log("file read done")

  const mess: ModelMessage[] = [
    {
      role: "user",
      content: [
        {
          type: "file",
          data: contentFile,
          mediaType: "application/pdf",
        },
        {
          type: "file",
          data: ratingFile,
          mediaType: "application/pdf",
        },
      ],
    },
  ]
  console.log("messages created")

  console.log("starting generation")

  const { object, response } = await generateObject({
    model: APP_CONFIG.practicalExamRating.model,
    system: `Your only job is to take files as input, read them, and genereate an object that contains info from the file and that matches the schema im providing to you. You are going to be provided with two files, one is for the exam content, the questions and details, other one is the pdf that tells you how to rate the exam, it contains list answers to the questions.  
Exam content guidelines:
    - skip all the nonsense that is not relevant to the exam objectives (example. "Instrukcja dla zdającego" section is useless, or the metadata that student is required to input at real exam like 'PESEL' or personal data)
    - skip the paragraphs that describe the images inside the exam content.
    - if you see any images inside skip them, dont recreate them, just skip them. Keep the exam content as it is, it will be referencing the images but dont worry i will handle that. Do not try to recrate any images with md tables or anything, just skip the image and continue with exam objectives.
    - focus on the exam questions only, any text that is not relevant for student while taking the exam should be skipped

    Exam rating data table guidelines:
    - table has answers to every question, you have to just mark an answer object as correct or not,  The schema will tell you everything you need to get
    `,
    schema,
    messages: mess,
  })

  console.log("generation done")
  console.dir(object, { depth: null })
}
