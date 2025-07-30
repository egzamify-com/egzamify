import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import AttachmentItem from "./attachment-item";

export default async function AttachmentsList({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <>
      {exam.examAttachments.map((attachment) => {
        return (
          <AttachmentItem
            key={`attachment-${attachment.attachmentId}`}
            attachmentId={attachment.attachmentId}
            attachmentName={attachment.attachmentName}
          />
        );
      })}
    </>
  );
}
