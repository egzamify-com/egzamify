"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { asyncMap } from "convex-helpers";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { type practicalExamAttachmentValidator } from "convex/praktyka/helpers";
import type { Infer } from "convex/values";
import z from "zod";
import { getFileUrl, getNextjsUser } from "./actions";

const examCheckOutputSchema = z.object({
  score: z
    .number()
    .describe("Total number of points, the correct 'answers' user scored."),
  percantageScore: z
    .number()
    .describe(
      "Different represantation of score, the total possible points to score for an exam will be provided",
    ),
  summary: z
    .string()
    .describe(
      "Summary in few sentances, it should tell user how he did, if there were same mistakes, if you detected any major errors in users thinking. General thought on the results and provided exam by user",
    ),
  details: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "This data will be provided in input, a rating data json will contain it, so just paste it here",
          ),
        note: z
          .optional(z.string())
          .describe(
            "This data will be provided in input, a rating data json will contain it, so just paste it here",
          ),
        symbol: z
          .string()
          .describe(
            "This data will be provided in input, a rating data json will contain it, so just paste it here",
          ),
        requirements: z.array(
          z.object({
            symbol: z
              .string()
              .describe(
                "This data will be provided in input, a rating data json will contain it, so just paste it here",
              ),
            description: z
              .string()
              .describe(
                "This data will be provided in input, a rating data json will contain it, so just paste it here",
              ),
            answer: z
              .object({
                isCorrect: z.boolean(),
                explanation: z.string(),
              })
              .describe("Store users answers data"),
          }),
        ),
      }),
    )
    .describe(
      "Detailed information about each requirement and its answer, including the explanation for answers that were incorrect, its actually a copy of the input value for the rating data, just added place for storing users answers",
    ),
});

export async function requestPracticalExamCheck(
  userExamId: Id<"usersPracticalExams">,
) {
  const user = await getNextjsUser();
  const userExam = await getUserExamDetails(userExamId);
  if (userExam.attachments?.length === 0)
    throw new Error("No attachments found");
  const realExam = await getRealExamDetails(userExam.examId);

  console.log("check for  - ", userExamId);
  console.log("user requesting - ", user);
  console.log("user sent attachments:");
  console.dir(userExam.attachments);
  console.log("base exam attachments:");
  console.dir(realExam.examAttachments);

  // const messages = userExam.attachments( attachment => {
  //   return
  // })

  // const { object } = await generateObject({
  //   model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
  //   schema: examCheckOutputSchema,
  //   system:
  //     "You are a assistant for young student learning for exams. You will be provided with a exam data like how to rate exam (every requirement is one point), also exam content, so actual exam tasks which user need to solve, and also you will be provided with exams attachments, which can be needed. This is only data for the base exam, next comes user data you will get. You will be provided with users files (in URL form), this is users solution for the exam. Your job is to understand base exam needs, and then compare the requirements to users work. You have to rate users exam, but the exam solution is in file format, can be multiple files. ",
  //   schemaName: "User's exam rating",
  //   schemaDescription:
  //     "Result of rating user's exam files based on exam rating data and exam actual content",
  //   messages: [
  //     {
  //       role: "user",
  //       content: [
  //         {
  //           type: "file",
  //           data: new URL("https://github.com"),
  //         },
  //       ],
  //     },
  //   ],
  // });
  // console.log("response - ", object);
}

async function getUserExamDetails(userExamId: Id<"usersPracticalExams">) {
  const userExam = await fetchQuery(
    api.praktyka.query.getUserExamDetails,
    {
      userExamId,
    },
    { token: await convexAuthNextjsToken() },
  );
  if (!userExam) throw new Error("User exam not found");
  if (!userExam.attachments) return userExam;
  userExam.attachments = await getAttachmentsUrls(userExam.attachments);

  return userExam;
}

async function getRealExamDetails(examId: Id<"basePracticalExams">) {
  const exam = await fetchQuery(
    api.praktyka.query.getExamDetails,
    {
      examId,
    },
    { token: await convexAuthNextjsToken() },
  );
  if (!exam) throw new Error("Exam not found");
  exam.examAttachments = await getAttachmentsUrls(exam.examAttachments);

  return exam;
}

async function getAttachmentsUrls(
  attachments: Infer<typeof practicalExamAttachmentValidator>,
) {
  return await asyncMap(attachments, async (attachment) => {
    const url = await getFileUrl(
      attachment.attachmentId,
      attachment.attachmentName,
      { raw: true },
    );
    return {
      ...attachment,
      url,
    };
  });
}
