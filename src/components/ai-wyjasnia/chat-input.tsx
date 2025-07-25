import type { ChatRequestOptions } from "ai";
import { Send } from "lucide-react";
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";

export default function ChatInput({
  selectedMode,
  onValueChange,
  handleSubmit,
  input,
  handleInputChange,
}: {
  selectedMode: AiWyjasniaMode;
  onValueChange: (value: string) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}) {
  return (
    <div className="bg-card sticky bottom-0 w-full space-y-4 rounded-t-xl border p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">AI Response Mode</Label>
        <RadioGroup
          value={selectedMode}
          onValueChange={onValueChange}
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={`Type your message (${APP_CONFIG.ai_wyjasnia.modes.find((m) => m.id === selectedMode)?.title} mode)...`}
          className="min-h-[20px] flex-1 whitespace-pre-wrap"
        />
        <Button type="submit" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
