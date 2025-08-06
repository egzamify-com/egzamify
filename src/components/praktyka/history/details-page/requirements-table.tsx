import type { Doc } from "convex/_generated/dataModel";
import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function RequirementsTable({
  aiRating,
}: {
  aiRating: Doc<"usersPracticalExams">["aiRating"];
}) {
  if (!aiRating) return null;
  if (!aiRating.details) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Objective Breakdown</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Status</TableHead>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Explanation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aiRating.details.map((category) => {
            return (
              <React.Fragment key={crypto.randomUUID()}>
                <TableRow>
                  <TableCell colSpan={4} className="text-lg font-bold">
                    {category.symbol} - {category.title}
                  </TableCell>
                </TableRow>
                {category.requirements.map((requirement) => {
                  return (
                    <TableRow key={crypto.randomUUID()}>
                      <TableCell>
                        {requirement.answer?.isCorrect ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <p>{requirement.symbol}</p>
                      </TableCell>
                      <TableCell>
                        <p>{requirement.description}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <p>{requirement.answer?.explanation ?? "N/A"}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
