import type { Id } from "convex/_generated/dataModel";
import { Download, Image as ImageIcon } from "lucide-react";
import { type ReactNode } from "react";
import { getFileUrl } from "~/lib/utils";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";

export default function AttachmentItem({
  attachmentName,
  attachmentId,
  actionButtons,
}: {
  attachmentName: string;
  url?: string;
  attachmentId?: Id<"_storage">;
  actionButtons?: ReactNode;
}) {
  const attachmentUrl = getFileUrl(attachmentId, attachmentName, {
    raw: false,
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-center rounded-lg border p-4 transition-colors">
        <div className="flex-1">
          <h4 className="font-medium">{attachmentName}</h4>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} className="text-muted-foreground">
                <ImageIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>{attachmentName}</DialogTitle>
              <img src={attachmentUrl} alt="attachment for exams" />
            </DialogContent>
          </Dialog>

          {attachmentUrl && (
            <a href={attachmentUrl} download={attachmentName}>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          )}

          {actionButtons}
        </div>
      </div>
    </div>
  );
}
