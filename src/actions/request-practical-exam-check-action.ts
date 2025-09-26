"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { generateObject, type FilePart, type ModelMessage } from "ai";
import { asyncMap } from "convex-helpers";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { type practicalExamAttachmentValidator } from "convex/praktyka/helpers";
import type { Infer } from "convex/values";
import mime from "mime";
import { z } from "zod/v4";
import { APP_CONFIG } from "~/APP_CONFIG";
import { getFileUrl } from "~/lib/utils";

export type PracticalExamCheckMode = "standard" | "complete";

export async function requestPracticalExamCheck(
  userExamId: Id<"usersPracticalExams">,
  mode: "standard" | "complete",
) {
  const gotCharged = await chargeCredits(getModePrice(mode));
  if (!gotCharged) {
    await updateUserExamStatus(userExamId, "not_enough_credits_error");
    return;
  }
  try {
    await updateUserExamStatus(userExamId, "ai_pending");
    const userExam = await getUserExamDetails(userExamId);
    const realExam = await getRealExamDetails(userExam.examId);
    console.log("check for  - ", userExamId);

    const userAttachments = transformAttachments(userExam.attachments);
    const examAttachments = transformAttachments(realExam.examAttachments);

    // feed the ai all the context it needs
    const resources: ModelMessage[] = [
      {
        role: "system",
        content: `
           ${APP_CONFIG.practicalExamRating.system}\n\n

           This is the rating schema you have to follow for this exam
           <ratingData>
           ${minimizeRatingDataJsonSize(realExam.ratingData)}
           </ratingData>

           Exam content (objectives)
           <exam content>
           ${cleanExamMarkdown(realExam.examInstructions)}
           </exam content>

           <exam max points>
           ${realExam.maxPoints}
           </exam max points>

           <exam qualification>
           ${realExam.qualification!.label}
           </exam qualification>
           `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Sprawdź mój egzamin w trybie ${mode}.`,
          },
          {
            type: "text",
            text: "Poniżej znajdują się **załączniki egzaminacyjne (bazowe)** – materiały referencyjne dostarczone w treści egzaminu. Nie są moją pracą i nie podlegają ocenie, ale mogą być pomocne przy analizie.",
          },
          ...examAttachments,
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Poniżej znajdują się **pliki egzaminacyjne użytkownika** – moja własna praca stworzona zgodnie z instrukcją egzaminu. Tylko te pliki należy ocenić.",
          },
          ...userAttachments,
        ],
      },
    ];
    console.dir(resources, { depth: null });
    const generatedRating = await generateAiCheck(mode, resources);
    await saveRatingData(userExamId, generatedRating);
    await updateUserExamStatus(userExamId, "done");
  } catch (e) {
    console.error("[PRACTICAL EXAM] Error - ", e);
    await refundCredits(getModePrice(mode));
    await updateUserExamStatus(userExamId, "unknown_error_credits_refunded");
  }
}
function getModePrice(mode: PracticalExamCheckMode) {
  switch (mode) {
    case "standard":
      return APP_CONFIG.practicalExamRating.standardPrice;
    case "complete":
      return APP_CONFIG.practicalExamRating.completePrice;
  }
}
async function chargeCredits(creditsToCharge: number) {
  const result = await fetchMutation(
    api.users.mutate.chargeCreditsOrThrow,
    {
      creditsToCharge,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );
  if (result.message === "user has enough credits") {
    console.log("user got charged");
    return true;
  }
  if (result.message === "user DOESNT have enough credits") {
    console.log("user doesnt have enough credits");
    return false;
  }
  return false;
}
async function refundCredits(creditsToRefund: number) {
  await fetchMutation(
    api.users.mutate.updateUserCredits,
    {
      creditsToAdd: creditsToRefund,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );
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
  if (!userExam.attachments) throw new Error("No attachments found");
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
    const url = getFileUrl(attachment.attachmentId, attachment.attachmentName, {
      raw: true,
    });
    return {
      ...attachment,
      url,
    };
  });
}
function transformAttachments(
  attachments: {
    url: string | undefined;
    attachmentName: string;
    attachmentId: Id<"_storage">;
  }[],
) {
  return attachments.map((attachment) => {
    const mimetype = mime.getType(attachment.url!);
    return {
      type: "file",
      data: new URL(attachment.url!),
      // skip sql because it errors ("not supported type")
      mediaType: `${(mimetype?.includes("application/") ? "text/plain" : mimetype) ?? "text/plain"}`,
      filename: attachment.attachmentName,
    } as FilePart;
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
    model: APP_CONFIG.practicalExamRating.model,
    schema: getSchema(mode),
    schemaName: APP_CONFIG.practicalExamRating.schemaName,
    schemaDescription: APP_CONFIG.practicalExamRating.schemaDescription,
    messages: resources,
  });
  console.dir(response, { depth: null });
  return object;
}

function minimizeRatingDataJsonSize(
  jsonData: Doc<"basePracticalExams">["ratingData"],
) {
  const formatted = jsonData
    .map((item) => {
      const requirements = item.requirements
        .map((req) => `${req.symbol}:${req.description}`)
        .join("; ");

      return `${item.symbol}|${item.title}|${requirements}|${item.note ?? ""}`;
    })
    .join("\n");

  const headerLine = `symbol|title|requirements(symbol:description;...)|optionalNote`;

  return headerLine + "\n" + formatted;
}
function cleanExamMarkdown(md: string): string {
  return (
    md
      // remove code fences and inline backticks
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`+/g, "")
      // remove markdown headings (#, ##, ###)
      .replace(/^#{1,6}\s*/gm, "")
      // remove bold/italic markers (*, _, **, __)
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
      // remove horizontal rules (--- or ***)
      .replace(/^\s*[-*_]{3,}\s*$/gm, "")
      // convert markdown bullets (-, *, +) into a dash prefix
      .replace(/^\s*[-*+]\s+/gm, "- ")
      // preserve numbered lists (leave "1. " etc. intact)
      // remove blockquotes
      .replace(/^\s*>+\s?/gm, "")
      // collapse multiple spaces
      .replace(/[ \t]+/g, " ")
      // collapse >2 newlines into just 2 (paragraph separation)
      .replace(/\n{3,}/g, "\n\n")
      // trim
      .trim()
  );
}
