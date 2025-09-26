import type { Id } from "convex/_generated/dataModel";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { getFileUrl } from "~/lib/utils";
import { Button } from "../../../ui/button";

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
  const urls = getFileUrl(attachmentId, attachmentName);

  return (
    <div className="grid gap-4">
      <div className="flex items-center rounded-lg border p-4 transition-colors">
        <div className="flex flex-1 flex-row items-center justify-start gap-2">
          <h4 className="font-medium">{attachmentName}</h4>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          {urls && (
            <>
              <Link href={urls.raw} target="_blank">
                <Button variant={"ghost"}>
                  <ExternalLink />
                </Button>
              </Link>
              <a href={urls.normal.toString()} download={attachmentName}>
                <Button variant="ghost">
                  <Download />
                </Button>
              </a>
              {actionButtons}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
