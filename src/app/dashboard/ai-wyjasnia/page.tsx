"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import ModeSelector from "./ModeSelector";
import UserManual from "./UserManual";

type AppState = "initialConfig" | "followUpPart" | "requestPending";

export default function AIExplainerPage() {
  const [userPrompt, setUserPrompt] = useState<string>("What is gravity?");
  const [selectedMode, setSelectedMode] = useState("");
  const [appState, setAppState] = useState<AppState>("initialConfig");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const {
    mutateAsync: requestAIExplanation,
    isPending,
    isError,
    data,
    error,
  } = api.aiWyjasnia.requestAiExplanation.useMutation();

  const handleSubmit = async () => {
    if ((appState === "initialConfig" && !userPrompt.trim()) || !selectedMode)
      return;

    if (appState === "followUpPart" && !selectedMode) return;

    setAppState("requestPending");

    await requestAIExplanation({
      mode: selectedMode,
      userPrompt: userPrompt,
      reroll: false,
    });

    if (isError) {
      console.log("[AI WYJASNIA] error while getting explanation", error);
      return;
    }
    setAppState("followUpPart");
  };

  function handleFollowUp() {
    console.log("follow up", followUpQuestion);
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

              {/* Submit and Reroll Buttons */}
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
                  {/* <Button
   variant="outline"
   onClick={handleReroll}
   disabled={!initialPrompt.trim() || !selectedMode || isLoading}
 >
   <RotateCcw className="h-4 w-4 mr-2" />
   Reroll
 </Button> */}
                </div>
              )}
            </>

            {/* Explanation Result Area */}
            {appState === "requestPending" && (
              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-slate-600">
                      Generating explanation...
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {appState === "followUpPart" && (
              <Card className="bg-slate-50">
                <CardContent className="">
                  <div className="flex items-center justify-center">
                    {data?.reponse}
                    <span className="ml-3 text-slate-600"></span>
                  </div>
                </CardContent>
              </Card>
            )}

            {appState === "followUpPart" && (
              <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-medium text-slate-700">
                  Follow-up Question
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a follow-up question about the explanation..."
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFollowUp()}
                  />
                  <Button
                    onClick={handleFollowUp}
                    disabled={!followUpQuestion.trim() || isLoading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
