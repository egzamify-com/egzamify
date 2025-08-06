"use client";

import type { Doc } from "convex/_generated/dataModel";
import { ChevronDown, FileText } from "lucide-react";
import Markdown from "marked-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export const Instructions = ({ exam }: { exam: Doc<"basePracticalExams"> }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Card
        className={cn("cursor-pointer transition-colors", "hover:bg-muted")}
        onClick={() => setIsExpanded((old) => !old)}
      >
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-end justify-center gap-1">
              <FileText className="mr-2 h-5 w-5" />
              Exam Instruction
            </div>
            <Button variant={"ghost"}>
              <ChevronDown
                className={cn(
                  `h-5 w-5 transition-transform`,
                  isExpanded ? "rotate-180" : "",
                )}
              />
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
      {isExpanded && (
        <CardContent>
          <div className="prose prose-md dark:prose-invert max-w-none">
            <Markdown>{exam.examInstructions}</Markdown>
          </div>
        </CardContent>
      )}
    </>
  );
};
