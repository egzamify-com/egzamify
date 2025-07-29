"use client";

import { ChevronDown, Download } from "lucide-react";

import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function AttachmentsCard({
  children,
}: {
  children?: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-1">
            <Download className="mr-2 h-5 w-5" />
            Reference Materials & Attachments
          </div>
          <Button
            variant={"ghost"}
            onClick={() => setIsExpanded((old) => !old)}
          >
            <ChevronDown
              className={cn(
                `h-5 w-5 transition-transform`,
                isExpanded ? "rotate-180" : "",
              )}
            />
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      )}
    </Card>
  );
}
