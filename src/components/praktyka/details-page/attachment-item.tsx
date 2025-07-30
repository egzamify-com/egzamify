"use client";

import { Download, Image as ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

export default function AttachmentItem({
  attachmentName,
  url,
  actionButtons,
}: {
  attachmentName: string;
  url: string;
  actionButtons?: ReactNode;
}) {
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
              <img src={url} alt="attachment for exams" />
            </DialogContent>
          </Dialog>
          <a href={url} download={attachmentName}>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
          {actionButtons}
        </div>
      </div>
    </div>
  );
}
