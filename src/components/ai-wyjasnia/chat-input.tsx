import type { ChatRequestOptions, CreateUIMessage } from "ai"
import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { CheckCircle, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { APP_CONFIG, type AiWyjasniaMode } from "~/APP_CONFIG"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Textarea } from "../ui/textarea"

export function ChatInputWithModeSelection({
  selectedMode,
  setSelectedMode,
  sendMessage,
}: {
  selectedMode: AiWyjasniaMode
  setSelectedMode: (mode: AiWyjasniaMode) => void
  sendMessage: (
    // @ts-expect-error idk, this works
    message: CreateUIMessage,
    options?: ChatRequestOptions,
  ) => Promise<void>
}) {
  const [input, setInput] = useState("")
  const { data: user } = useQuery(api.users.query.getCurrentUser)

  return (
    <>
      <div className="bg-card sticky bottom-0 w-full space-y-4 rounded-t-xl border p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tryb odpowiedzi AI</Label>
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value)}
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
            e.preventDefault()
            sendMessage({
              text: input,
              metadata: {
                mode: selectedMode,
                createdAt: Date.now(),
              },
            })
            setInput("")
          }}
          className="flex flex-col gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Zapytaj o cokolwiek ...`}
            className="flex min-h-[20px] whitespace-pre-wrap"
          />
          <div className="flex w-full items-center justify-end">
            <Button
              type="submit"
              className="w-1/5"
              disabled={
                !input.trim() ||
                (user?.credits ?? 0) <
                  APP_CONFIG.ai_wyjasnia.creditPricePerMessage
              }
            >
              <Send className="h-4 w-4" />
              {APP_CONFIG.ai_wyjasnia.creditPricePerMessage}
              <CheckCircle />
            </Button>

            {(user?.credits ?? 0) <
              APP_CONFIG.ai_wyjasnia.creditPricePerMessage && (
              <Link href="/credits">
                <Button>Zdobądź kredyty</Button>
              </Link>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
