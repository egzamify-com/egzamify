import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Sidebar({
  exam,
}: {
  exam: FunctionReturnType<typeof api.praktyka.query.getExamDetails>;
}) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button size="lg" className="w-full">
              <User className="mr-2 h-4 w-4" />
              test button label
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
