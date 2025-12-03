"use client"

import type { ChatRequestOptions, CreateUIMessage } from "ai"
import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { OctagonX, Plus, Stars } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { MyUIMessage } from "~/app/api/chat/route"
import { APP_CONFIG } from "~/APP_CONFIG"
import { cn } from "~/lib/utils"
import CreditIcon from "../credit-icon"
import GetCreditsAlert from "../get-credits-alert"
import { Button, type ButtonProps } from "../ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
export function ChatInputWithModeSelection({
  selectedMode,
  setSelectedMode,
  sendMessage,
  messages,
}: {
  selectedMode: string
  setSelectedMode: (mode: string) => void
  sendMessage: (
    // @ts-expect-error idk, this works
    message: CreateUIMessage,
    options?: ChatRequestOptions,
  ) => Promise<void>
  messages: MyUIMessage[]
}) {
  const [isMessageLimitReached, setIsMessageLimitReached] = useState(false)
  const [input, setInput] = useState("")
  const { data: user } = useQuery(api.users.query.getCurrentUser)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (
      messages.length > APP_CONFIG.ai_wyjasnia.maxMessagesPerChat &&
      messages.length % 2 === 0
    ) {
      setIsMessageLimitReached(true)
      toast.error("Limit wiadomości na czat został przekroczony", {
        description: "Stwórz nowy czat aby kontynuować nauke",
        duration: 5000,
      })
      return
    }
  }, [messages.length])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && formRef.current) {
      e.preventDefault()
      formRef.current.requestSubmit()
    }
  }

  return (
    <>
      {isMessageLimitReached && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-row gap-2">
            <OctagonX className="text-destructive" />
            <p className="text-destructive">
              Przekroczono limit wiadomości na czat
            </p>
          </div>
          <Link href={"/dashboard/ai-wyjasnia"}>
            <Button variant={"outline"}>
              <Plus /> Stwórz nowy czat
            </Button>
          </Link>
        </div>
      )}
      <div
        className={cn(
          `bg-card sticky bottom-0 w-full space-y-4 rounded-t-xl border p-4`,
          isMessageLimitReached &&
            "border-t-destructive border-l-destructive border-r-destructive",
        )}
      >
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tryb odpowiedzi AI</Label>
          <RadioGroup
            disabled={isMessageLimitReached}
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
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()

            if (input.trim().length === 0) {
              return
            }

            if (
              input.length > APP_CONFIG.ai_wyjasnia.maxUserMessageCharacters
            ) {
              toast.error("Nie udało się wysłać wiadomości", {
                description: "Wiadomość jest za długa",
              })
              return
            }

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
          <InputGroup
            className={cn(isMessageLimitReached && "border-destructive border")}
          >
            <InputGroupTextarea
              disabled={isMessageLimitReached}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Zapytaj o cokolwiek ...`}
              onKeyDown={handleKeyDown}
            />
            <InputGroupAddon align="block-end">
              {user &&
              (user?.credits ?? 0) >=
                APP_CONFIG.ai_wyjasnia.creditPricePerMessage ? (
                <SendButton type="submit" />
              ) : (
                <div className="flex w-full flex-row justify-end">
                  <GetCreditsAlert>
                    <SendButton />
                  </GetCreditsAlert>
                </div>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </>
  )
}

function SendButton({ ...props }: ButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="ml-auto">
        <InputGroupButton
          {...props}
          className="ml-auto"
          size="sm"
          variant="default"
        >
          <Stars />
          Wyślij
        </InputGroupButton>
      </TooltipTrigger>
      <TooltipContent className="flex flex-row items-center justify-center gap-1">
        0.5 <CreditIcon className="h-4 w-4" flipTheme />
      </TooltipContent>
    </Tooltip>
  )
}
