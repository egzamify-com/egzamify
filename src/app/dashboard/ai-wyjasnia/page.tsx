"use client";

import { History, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import RenderAiResponses from "~/app/dashboard/ai-wyjasnia/RenderAiResponses";
import ResponseLoader from "~/components/ai-wyjasnia/ResponseLoader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { AiResponseWithFollowUpQuesion } from "~/server/db/schema/ai-wyjasnia";
import { api } from "~/trpc/react";
import { tryCatch } from "~/utils/tryCatch";
import UserManual from "../../../components/ai-wyjasnia/UserManual";
import FollowUpQuestion from "./FollowUpQuestion";
import ModeSelector from "./ModeSelector";

// initial config -> first user prompt and mode selection
// follow up -> user can keep asking addidtional questions
type AppState = "initialConfig" | "followUpPart" | "requestPending";

export default function AIExplainerPage() {
  const utils = api.useUtils();
  const [appState, setAppState] = useState<AppState>("initialConfig");
  const [userPrompt, setUserPrompt] = useState<string>("Co to grawitacja?");
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const [aiResponses, setAiResponses] = useState<
    AiResponseWithFollowUpQuesion[]
  >([]);
  const explanationId = useRef<string>("");

  const { mutateAsync: requestAIExplanation, isPending } =
    api.aiWyjasnia.requestAiExplanation.useMutation();

  async function handleSubmit() {
    if ((appState === "initialConfig" && !userPrompt.trim()) || !selectedMode)
      return;

    if (appState === "followUpPart" && !selectedMode) return;

    setAppState("requestPending");

    console.log("submitting with: ", selectedMode, userPrompt);

    const [data, error] = await tryCatch(
      requestAIExplanation({
        currentMode: selectedMode,
        currentUserPrompt: userPrompt,
      }),
    );

    if (error || !data?.response) {
      console.log("[AI WYJASNIA] error while getting explanation", error);
      toast.error(
        "Wystąpił błąd podczas wykonywania zapytania, spróbuj ponownie",
      );
      setAppState("initialConfig");
      return;
    }
    console.log("data from submit", data);
    setAiResponses((prev) => [
      ...prev,
      {
        aiResponse: data.response,
        userPrompt: userPrompt,
        mode: selectedMode,
      },
    ]);
    explanationId.current = data.explanationId;

    setAppState("followUpPart");
    void utils.aiWyjasnia.getAiResponsesHistory.reset();
  }

  async function handleFollowUp() {
    console.log("follow up", followUpQuestion);

    if (!followUpQuestion.trim()) return;

    setAppState("requestPending");

    console.log(
      "ai reponses previous",
      aiResponses.map((x) => x.aiResponse).join("\n"),
    );
    const [data, error] = await tryCatch(
      requestAIExplanation({
        currentMode: selectedMode,
        currentUserPrompt: followUpQuestion,
        previousExplanationWithFollowUpQuestions: aiResponses,
        explanationId: explanationId.current,
      }),
    );
    if (error || !data?.response) {
      console.log("[AI WYJASNIA] error while getting explanation", error);
      toast.error(
        "Wystąpił błąd podczas wykonywania zapytania, spróbuj ponownie",
      );
      setAppState("followUpPart");
      return;
    }
    console.log(aiResponses);
    console.log(data.response);
    setAiResponses((prev) => [
      ...prev,
      {
        userPrompt: followUpQuestion,
        aiResponse: data.response,
        mode: selectedMode,
      },
    ]);

    console.log(aiResponses);
    setAppState("followUpPart");
    setFollowUpQuestion("");

    void utils.aiWyjasnia.getAiResponsesHistory.reset();
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserManual />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <p>
                  {appState === "initialConfig"
                    ? "Customize your experience"
                    : "Feel free ask follow up questions"}
                </p>
              </div>
              <div>
                <Button variant={"outline"} asChild>
                  <Link href={"/dashboard/ai-wyjasnia/history"}>
                    <History /> History
                  </Link>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {appState === "initialConfig" && (
              <>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-slate-700">
                    What would you like me to explain?
                  </Label>
                  <Textarea
                    placeholder={
                      "Enter your topic, question, or concept here... (e.g., 'How does machine learning work?' or 'Explain quantum computing"
                    }
                    value={userPrompt}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setUserPrompt(e.target.value)
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <ModeSelector
                  selectedMode={selectedMode}
                  handleSelectMode={(mode: string) => setSelectedMode(mode)}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!userPrompt.trim() || !selectedMode || isPending}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {"Submit"}
                  </Button>
                </div>
              </>
            )}

            {appState === "requestPending" && (
              <>
                <RenderAiResponses aiResponses={aiResponses} />
                <ResponseLoader />
              </>
            )}

            {appState === "followUpPart" && (
              <>
                {/* <UserPrompt userPrompt={userPrompt} /> */}
                <RenderAiResponses aiResponses={aiResponses} />
                <FollowUpQuestion
                  followUpQuestion={followUpQuestion}
                  handleFollowUp={(input: string) => setFollowUpQuestion(input)}
                  isPending={isPending}
                  submitFollowUpQuestion={handleFollowUp}
                />
                <ModeSelector
                  selectedMode={selectedMode}
                  handleSelectMode={(mode: string) => setSelectedMode(mode)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
