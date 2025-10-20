"use client"

import type schema from "convex/schema"
import type { Infer } from "convex/values"
import { ArrowRight, Brain } from "lucide-react"
import SpinnerLoading from "~/components/spinner-loading"
import { Card } from "~/components/ui/card"

type Status = Infer<
  typeof schema.tables.usersPracticalExams.validator.fields.status
>

export function ExamLoadingScreen({ status }: { status: Status }) {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden">
      <Card className="w-full p-6">
        {/* AI Brain Icon with pulse animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="bg-primary/40 animate-pulse-slow absolute inset-0 rounded-full blur-2xl" />
            <div className="bg-primary/10 border-primary/30 animate-pulse-glow relative rounded-full border-2 p-6">
              <Brain className="text-primary h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-balance md:text-4xl">
            Sprawdzamy twój egzamin
          </h1>
          <p className="text-muted-foreground text-lg">
            Nasze zaawansowane AI dokładnie przeanalizuje twoją prace
          </p>
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-4">
          <SpinnerLoading />
          <h1 className="text-2xl font-semibold">
            {status === "parsing_exam" && "Przetwarzamy twój egzamin."}
            {status === "ai_pending" && "AI pracuje nad twoim egzaminem."}
          </h1>
        </div>

        <div className="border-primary/20 rounded-lg border p-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex-shrink-0 rounded-lg p-2">
              <ArrowRight className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold">
                Nie ma potrzeby czekać tutaj!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Możesz bezpiecznie opuścić tę stronę, gdy twoje wyniki będą
                gotowe powiadomimy Cię.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
