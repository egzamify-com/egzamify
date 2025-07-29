import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { getFileFromId } from "~/lib/utils";
import AttachmentItem from "./attachment-item";

export default async function AttachmentsList({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <>
      {exam.examAttachments.map((attachment) => {
        const url = getFileFromId(
          attachment.attachmentId,
          attachment.attachmentName,
        );
        return (
          <AttachmentItem
            key={`attachment-${attachment.attachmentId}`}
            url={url}
            attachment={attachment}
          />
        );
      })}
    </>
  );
}
