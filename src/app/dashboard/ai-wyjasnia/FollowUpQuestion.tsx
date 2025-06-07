import { Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function FollowUpQuestion({
  followUpQuestion,
  handleFollowUp,
  isPending,
  submitFollowUpQuestion,
}: {
  followUpQuestion: string;
  handleFollowUp: (followUpQuestion: string) => void;
  isPending: boolean;
  submitFollowUpQuestion: () => void;
}) {
  return (
    <div className="space-y-2 pt-4 border-t">
      <label className="text-sm font-medium text-slate-700">
        Follow-up Question
      </label>
      <div className="flex gap-2">
        <Input
          placeholder="Ask a follow-up question about the explanation..."
          value={followUpQuestion}
          onChange={(e) => handleFollowUp(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && submitFollowUpQuestion()}
        />
        <Button
          onClick={submitFollowUpQuestion}
          disabled={!followUpQuestion.trim() || isPending}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
