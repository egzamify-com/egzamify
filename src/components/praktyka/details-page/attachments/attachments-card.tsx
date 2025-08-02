"use client";

import { ChevronDown, Download } from "lucide-react";

import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export default function AttachmentsCard({
  children,
}: {
  children?: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Card
        className={cn("cursor-pointer transition-colors", "hover:bg-muted")}
        onClick={() => setIsExpanded((old) => !old)}
      >
        <CardHeader className="">
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-end justify-center gap-1">
              <Download className="mr-2 h-5 w-5" />
              Reference Materials & Attachments
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
      {/*!!! only change visibility in styles, so the images dont hit server so much, now only 1 req for url is needed */}
      <CardContent
        className={cn(`flex flex-col gap-4`, isExpanded ? "flex" : "hidden")}
      >
        {children}
      </CardContent>
    </>
  );
}
