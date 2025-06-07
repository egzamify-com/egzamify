"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AiResponses from "~/components/ai-wyjasnia/AiResponses";
import ResponseLoader from "~/components/ai-wyjasnia/ResponseLoader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { tryCatch } from "~/utils/tryCatch";
import FollowUpQuestion from "./FollowUpQuestion";
import ModeSelector from "./ModeSelector";
import UserManual from "./UserManual";

type AppState = "initialConfig" | "followUpPart" | "requestPending";

export default function AIExplainerPage() {
  const [userPrompt, setUserPrompt] = useState<string>("What is gravity?");
  const [selectedMode, setSelectedMode] = useState("");
  const [appState, setAppState] = useState<AppState>("initialConfig");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const { mutateAsync: requestAIExplanation, isPending } =
    api.aiWyjasnia.requestAiExplanation.useMutation();

  async function handleSubmit() {
    if ((appState === "initialConfig" && !userPrompt.trim()) || !selectedMode)
      return;

    if (appState === "followUpPart" && !selectedMode) return;

    setAppState("requestPending");

    const [data, error] = await tryCatch(
      requestAIExplanation({
        mode: selectedMode,
        userPrompt: userPrompt,
        reroll: false,
      }),
    );

    if (error || !data?.reponse) {
      console.log("[AI WYJASNIA] error while getting explanation", error);
      toast.error(
        "Wystąpił błąd podczas wykonywania zapytania, spróbuj ponownie",
      );
      setAppState("initialConfig");
      return;
    }

    setAiResponses((prev) => [...prev, data.reponse]);
    setAppState("followUpPart");
  }

  async function handleFollowUp() {
    console.log("follow up", followUpQuestion);

    if (!followUpQuestion.trim()) return;

    setAppState("requestPending");

    console.log("ai reponses previous", aiResponses.join("\n"));
    const [data, error] = await tryCatch(
      requestAIExplanation({
        mode: selectedMode,
        userPrompt: userPrompt,
        reroll: false,
        previousExplanation: aiResponses.join("\n"),
        followUpQuestion: followUpQuestion,
      }),
    );
    if (error || !data?.reponse) {
      console.log("[AI WYJASNIA] error while getting explanation", error);
      toast.error(
        "Wystąpił błąd podczas wykonywania zapytania, spróbuj ponownie",
      );
      setAppState("initialConfig");
      return;
    }

    setAiResponses((prev) => [...prev, data.reponse]);
    setAppState("followUpPart");
    setFollowUpQuestion("");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserManual />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Customize your experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <>
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-medium text-slate-700">
                  What would you like me to explain?
                </Label>
                <Textarea
                  disabled={appState !== "initialConfig"}
                  placeholder={
                    "Enter your topic, question, or concept here... (e.g., 'How does machine learning work?' or 'Explain quantum computing"
                  }
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <ModeSelector
                selectedMode={selectedMode}
                handleSelectMode={(mode: string) => setSelectedMode(mode)}
                disabled={appState !== "initialConfig"}
              />

              {appState == "initialConfig" && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!userPrompt.trim() || !selectedMode || isPending}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPending ? "Generating..." : "Submit"}
                  </Button>
                </div>
              )}
            </>

            {appState === "requestPending" && (
              <>
                <AiResponses aiResponses={aiResponses} />
                <ResponseLoader />
              </>
            )}

            {appState === "followUpPart" && (
              <AiResponses aiResponses={aiResponses} />
            )}

            {appState === "followUpPart" && (
              <FollowUpQuestion
                followUpQuestion={followUpQuestion}
                handleFollowUp={(input: string) => setFollowUpQuestion(input)}
                isPending={isPending}
                submitFollowUpQuestion={handleFollowUp}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
