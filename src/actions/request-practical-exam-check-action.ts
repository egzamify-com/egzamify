"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { generateObject, type ModelMessage, type UserContent } from "ai";
import { asyncMap } from "convex-helpers";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { type practicalExamAttachmentValidator } from "convex/praktyka/helpers";
import type { Infer } from "convex/values";
import mime from "mime";
import { z } from "zod/v4";
import { getFileUrl, getNextjsUser } from "./actions";

export type PracticalExamCheckMode = "standard" | "complete";

export async function requestPracticalExamCheck(
  userExamId: Id<"usersPracticalExams">,
  mode: "standard" | "complete",
) {
  await updateUserExamStatus(userExamId, "ai_pending");
  const user = await getNextjsUser();
  const userExam = await getUserExamDetails(userExamId);
  if (!userExam.attachments) throw new Error("No attachments found");
  const realExam = await getRealExamDetails(userExam.examId);

  console.log("check for  - ", userExamId);
  console.log("user requesting - ", user);
  console.log("user sent attachments:");
  console.dir(userExam.attachments);
  console.log("base exam attachments:");
  console.dir(realExam.examAttachments);
  console.log("mode selected - ", mode);

  const userAttachments = transformAttachments(userExam.attachments);
  const examAttachments = transformAttachments(realExam.examAttachments);

  // feed the ai all the context it needs
  const resources: ModelMessage[] = [
    {
      role: "user",
      content: examAttachments,
    },
    {
      role: "user",
      content: userAttachments,
    },
    {
      role: "user",
      content: `I want to check my exam in ${mode} mode.`,
    },
    {
      role: "assistant",
      content: `This is the rating schema you have to follow for this exam:
      <ratingData>
      ${JSON.stringify(realExam.ratingData)}
      </ratingData>

      this is the exam content (objectives):
      <exam content>
      ${JSON.stringify(realExam.examInstructions)}
      </exam content>

      exam max points: ${realExam.maxPoints}

      qualification for this exam: ${realExam.qualification!.label}

      `,
    },
  ];

  const generatedRating = await generateAiCheck(mode, resources);
  await saveRatingData(userExamId, generatedRating);
  await updateUserExamStatus(userExamId, "done");
}

async function updateUserExamStatus(
  userExamId: Id<"usersPracticalExams">,
  newStatus: Doc<"usersPracticalExams">["status"],
) {
  await fetchMutation(
    api.praktyka.mutate.updateUserExamStatus,
    {
      userExamId,
      newStatus,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );
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
  if (!userExam.attachments) throw new Error("User exam attachments not found");
  const urls = await getAttachmentsUrls(userExam.attachments);
  return {
    ...userExam,
    attachments: urls,
  };
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
  const urls = await getAttachmentsUrls(exam.examAttachments);

  return { ...exam, examAttachments: urls };
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
function transformAttachments(
  attachments: {
    url: string | null;
    attachmentName: string;
    attachmentId: Id<"_storage">;
  }[],
): UserContent {
  return attachments.map((attachment) => {
    const mimetype = mime.getType(attachment.url!);
    return {
      type: "file",
      data: new URL(attachment.url!),
      // skip sql because it errors ("not supported type")
      mediaType: `${mimetype !== "application/sql" ? mimetype : "text/plain"}`,
      filename: attachment.attachmentName,
    };
  });
}
function getSchema(mode: PracticalExamCheckMode) {
  const ratingSchema = z
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
    );

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
  });

  if (mode === "complete") {
    console.log("got to extending schema");
    return examCheckOutputSchema.extend({
      details: ratingSchema,
    });
  }
  console.log("used base schema");
  return examCheckOutputSchema;
}
async function saveRatingData(
  userExamId: Id<"usersPracticalExams">,
  ratingData: z.infer<ReturnType<typeof getSchema>>,
) {
  await fetchMutation(
    api.praktyka.mutate.saveRatingData,
    {
      userExamId,
      ratingData,
    },
    { token: await convexAuthNextjsToken() },
  );
}
async function generateAiCheck(
  mode: PracticalExamCheckMode,
  resources: ModelMessage[],
) {
  const { object, response } = await generateObject({
    model: "google/gemini-2.0-flash",
    schema: getSchema(mode),
    system:
      "You are a assistant for young student learning for exams. You will be provided with a exam data like how to rate exam (every requirement is one point), also exam content, so actual exam tasks which user need to solve, and also you will be provided with exams attachments, which can be needed. This is only data for the base exam, next comes user data you will get. You will be provided with users files (in URL form), this is users solution for the exam. Your job is to understand base exam needs, and then compare the requirements to users work. You have to rate users exam, but the exam solution is in file format, can be multiple files. Also be aware that the studets are polish and are taking polish exams 'Egzamin Zawodowy'. You support two modes, first one 'standard', in this mode you only return summary, and points, you dont care about requrements(details). Second mode is complete, in this mode you return to user full output with details array.   ",
    schemaName: "User's exam rating data",
    schemaDescription:
      "Result of rating user's exam files based on exam rating data and exam actual content",
    messages: resources,
  });
  console.log("what we passeed - ");
  console.dir(resources, { depth: null });
  console.log("response - ");
  console.dir(object, { depth: null });
  console.dir(response, { depth: null });
  return object;
}
