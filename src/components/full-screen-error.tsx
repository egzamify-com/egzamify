"use client";

import { OctagonX, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export default function FullScreenError({
  errorMessage = "Unexpected error occurred",
  errorDetail = "",
  actionButton,
}: {
  errorMessage?: string;
  errorDetail?: string;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
      <OctagonX className="text-destructive" size={50} />
      <h1 className="text-3xl font-bold">{errorMessage}</h1>
      <p className="max-w-[50%] text-center text-sm">{errorDetail}</p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Button
          variant={"outline"}
          onClick={() => {
            location.reload();
          }}
        >
          <RotateCcw /> Reload page
        </Button>
        {actionButton && <>{actionButton}</>}
      </div>
    </div>
  );
}
