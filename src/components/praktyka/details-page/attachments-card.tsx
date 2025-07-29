import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Download } from "lucide-react";
import { getFileFromId } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import AttachmentItem from "./attachment-item";

export default function AttachmentsCard({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Reference Materials & Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
      </CardContent>
    </Card>
  );
}
