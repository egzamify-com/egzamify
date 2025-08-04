import type { ChatRequestOptions, CreateUIMessage } from "ai";
import { Send } from "lucide-react";
import { useState } from "react";
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

export function ChatInputWithModeSelection({
  selectedMode,
  setSelectedMode,
  sendMessage,
}: {
  selectedMode: AiWyjasniaMode;
  setSelectedMode: (mode: AiWyjasniaMode) => void;
  sendMessage: (
    message: CreateUIMessage | string,
    options?: ChatRequestOptions,
  ) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <>
      <div className="bg-card sticky bottom-0 w-full space-y-4 rounded-t-xl border p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">AI Response Mode</Label>
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as AiWyjasniaMode)}
            className="flex flex-wrap gap-4"
          >
            {APP_CONFIG.ai_wyjasnia.modes.map((mode) => (
              <div key={mode.id} className="flex items-center space-x-2">
                <RadioGroupItem value={mode.title} id={mode.id} />
                <Label htmlFor={mode.id} className="cursor-pointer">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{mode.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {mode.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({
              text: input,
              metadata: { mode: selectedMode, createdAt: Date.now() },
            });
            setInput("");
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type your message (${APP_CONFIG.ai_wyjasnia.modes.find((m) => m.id === selectedMode)?.title} mode)...`}
            className="min-h-[20px] flex-1 whitespace-pre-wrap"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
