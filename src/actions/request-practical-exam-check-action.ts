"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { asyncMap } from "convex-helpers";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import type { practicalExamAttachmentValidator } from "convex/praktyka/helpers";
import type { Infer } from "convex/values";
import { getFileUrl, getNextjsUser } from "./actions";

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
