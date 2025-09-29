"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function DeleteAttachment({
  attachmentId,
  userExamId,
}: {
  attachmentId: Id<"_storage">;
  userExamId: Id<"usersPracticalExams">;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAttachment = useMutation(api.praktyka.mutate.deleteAttachment);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-destructive hover:text-destructive"
          onClick={async () => {
            setIsDeleting(true);
            await deleteAttachment({
              attachmentId: attachmentId,
              userExamId: userExamId,
            });
            setIsDeleting(false);
          }}
        >
          {isDeleting ? <SpinnerLoading /> : <Trash2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delete attachment</p>
      </TooltipContent>
    </Tooltip>
  );
}
