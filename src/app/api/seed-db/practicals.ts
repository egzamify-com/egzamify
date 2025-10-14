// nlx convex import --table basePracticalExams --append --deployment-name confident-aardvark-526  ./seed-db/practicals.json

import { generateObject, type ModelMessage } from "ai"
import { readFile, writeFile } from "node:fs/promises"
import z, { type Infer } from "zod"
import { APP_CONFIG } from "~/APP_CONFIG"
import type { Input } from "./route"

const schema = z.object({
  qualificationId: z
    .string()
    .describe(
      "Skip this field completly, leave it empty because its not present in pdf.",
    ),
  code: z
    .string()
    .describe(
      "Code is a string that is unique for each exam it will look something like that: E.14-01-24.06-SG. It will be on first page of exam content pdf.",
    ),
  maxPoints: z
    .number()
    .describe(
      "It represents how many points can be scored in this exam. You have to calculate it from the table. Each requirement is worth 1 point (example R.1.1). You have to skip the separators, only count actual requirements that look like this R.1.2, R.2.3, R.4.4",
    ),
  examInstructions: z
    .string()
    .describe(
      "The most imporant field next to ratingData. Hold actual exam instructions, the objectives, the criteria. This is the place for your extracted long text in md format. Focus on this field, dont skip anything from the pdf exam content.",
    ),
  examDate: z
    .string()
    .describe(
      "Exam date can be derived from the exam code, i want it to look like that 'Month YEAR', so from code that looks like this E.14-01-24.06-SG, the date you have to derive will look like this 'Czerwiec 2024', the 24.06 is the bit that tells me that",
    ),
  examAttachments: z
    .array(
      z.object({
        attachmentName: z.string(),
        attachmentId: z.string(),
      }),
    )
    .describe("Skip this field completly."),
  ratingData: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "Its the title of requirement type like the text next to R.1",
          ),
        note: z
          .optional(z.string())
          .describe("Its the smaller text below the title"),
        symbol: z
          .string()
          .describe(
            "Its the symbol of the requirement type like for example R.1, R.2",
          ),
        requirements: z
          .array(
            z
              .object({
                symbol: z
                  .string()
                  .describe("The symbol of the requirement for example R.2.3"),
                description: z
                  .string()
                  .describe("The content of the requirement"),
                answer: z
                  .optional(
                    z.object({
                      isCorrect: z.boolean(),
                      explanation: z.string(),
                    }),
                  )
                  .describe("Leave this field empty its for later use"),
              })
              .describe("The requirement"),
          )
          .describe("Its a list of the actual requirements."),
      }),
    )
    .describe(
      "This is the second most important field after the exam content. This field holds the data from the rating pdf. Here you have to put all the rating data you get from the table of requirements.",
    ),
})

export async function main({ contentPdf, qualificationId, ratingPdf }: Input) {
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
    system: `Your only job is to take files as input, read them, and genereate an object that contains info from the file and that matches the schema im providing to you. You are going to be provided with two files, one is for the exam content, the questions and details, other one is the pdf that tells you how to rate the exam, it contains list of requirements. You have to extract the info from them as object with the provided schema.
    Exam content guidelines:
    - skip all the nonsense that is not relevant to the exam objectives (example. "Instrukcja dla zdającego" section is useless, or the metadata that student is required to input at real exam like 'PESEL' or personal data)
    - If exam contains something about unzipping files from exam machine skip it. skip the paragraph that tells students how to unzip the exam files from the school machine. I dont care about that so just dont include this paragraph in the exam content
    - skip the paragraphs that describe the images inside the exam content.
    - if you see any images inside skip them, dont recreate them, just skip them. Keep the exam content as it is, it will be referencing the images but dont worry i will handle that. Do not try to recrate any images with md tables or anything, just skip the image and continue with exam objectives.
    - use markdown format to best describe the exam objectives, use lists big headings for sections and recreate tables if needed.
    - remember that the whole thing has to be as similar to the original content as possible. Do not come up with anything from scratch. Of course the extracted content has to be still in polish language
    - focus on the exam objectives only, any text that is not relevant for student while taking the exam should be skipped
    - **Strictly use Markdown syntax for structure and presentation.**
    - **Use single-hash headings ('#') for the main title (e.g., '# Zadanie Egzaminacyjne').**
    - **Use double-hash headings ('##') for major sections (e.g., '## Operacje na bazie danych', '## Witryna internetowa', '## Styl CSS').**
    - **Separate all major sections with a Markdown horizontal rule ('---').**
    - **Format all steps and requirements (e.g., database operations, website features) using proper Markdown unordered lists (' *
      ') or numbered lists.**

    Exam rating data table guidelines:
    - table has some main points and list of requirements for each point, you need to get everything. The schema will tell you everything you need to get
    `,
    schema,
    messages: mess,
  })

  console.log("generation done")
  console.dir(object, { depth: null })

  const arr = z.array(schema)
  const jsonFile = await readFile(
    "./src/app/api/seed-db/practicals.json",
    "utf-8",
  )

  const data: Infer<typeof arr> = JSON.parse(jsonFile)
  console.log({ data })

  data.push({ ...object, qualificationId: qualificationId })

  const updatedJsonContent = JSON.stringify(data, null, 2)

  await writeFile(
    "./src/app/api/seed-db/practicals.json",
    updatedJsonContent,
    "utf-8",
  )

  console.log("Successfully appended new data and replaced the file content.")
}
