"use client"

import { api } from "convex/_generated/api"
import type { FeedbackType } from "convex/feedback/feedback"
import { Authenticated, Unauthenticated, useMutation } from "convex/react"
import { Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import FullScreenError from "~/components/full-screen-error"
import LogInBtn from "~/components/landing-page/log-in-btn"
import SpinnerLoading from "~/components/spinner-loading"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "~/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { cn } from "~/lib/utils"

const items: FeedbackType[] = ["Błąd", "Propozycja funkcji", "Opinia"]

const defaultType: FeedbackType = "Błąd"

export default function Page() {
  const sendFeedback = useMutation(api.feedback.feedback.sendFeedback)
  const [didMutationFail, setDidMutationFail] = useState(false)
  const [content, setContent] = useState("")
  const [selectedType, setSelectedType] = useState<FeedbackType>(defaultType)
  const [isActionPending, setIsActionPending] = useState(false)

  return (
    <>
      <Authenticated>
        <div className="flex flex-1 flex-col items-center justify-start pt-10">
          <div className="flex flex-col items-center justify-center gap-4 p-40">
            <div>
              <h1 className="text-center text-3xl font-bold">
                Podziel się swoją opinią!
              </h1>
              <p>
                Jeśli napotkałeś problem, lub masz sugestię, prosimy o
                zgłoszenie.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full flex-col gap-2">
                <InputGroup
                  onFocus={() => setDidMutationFail(false)}
                  className={cn(didMutationFail && "border-destructive border")}
                >
                  <InputGroupTextarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Zapytaj o cokolwiek ...`}
                  />
                  <InputGroupAddon align="block-end">
                    <Select
                      onValueChange={(e: FeedbackType) => setSelectedType(e)}
                      defaultValue={defaultType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => {
                          return (
                            <SelectItem key={crypto.randomUUID()} value={item}>
                              {item}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <InputGroupButton
                      type="submit"
                      className="ml-auto"
                      size="sm"
                      variant="default"
                      onClick={async () => {
                        console.log({ content })
                        console.log({ selectedType })
                        setIsActionPending(true)
                        try {
                          if (!content) {
                            toast.error("Proszę wpisać treść zgłoszenia.")
                            setIsActionPending(false)
                            setDidMutationFail(true)
                            return
                          }
                          await sendFeedback({ content, type: selectedType })
                          setIsActionPending(false)
                          setDidMutationFail(false)
                          setContent("")
                          toast.success("Przesłano zgłoszenie.", {
                            description: "Dziękujemy za twoją opinię!",
                          })
                        } catch (e) {
                          setIsActionPending(false)
                          setDidMutationFail(true)
                          console.error(
                            "[FEEDBACK] Error while sending feedback: ",
                            e,
                          )
                          toast.error(
                            "Przepraszamy, nie udało się wysłąć twojego zgłoszenia.",
                            {
                              description:
                                "Możliwe że przekroczyłeś limit możliwych zgłoszeń na godzinę. Prosimy sprobować ponownie później.",
                            },
                          )
                        }
                      }}
                    >
                      {isActionPending ? (
                        <SpinnerLoading />
                      ) : (
                        <>
                          <Send />
                          <p>Wyślij</p>
                        </>
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <FullScreenError
          type="warning"
          errorMessage="Zaloguj się aby zgłosić problem lub podzielić się swoją opinią"
          actionButton={<LogInBtn />}
        />
      </Unauthenticated>
    </>
  )
}
