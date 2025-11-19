"use client"

import {
  BookOpen,
  Clock,
  Database,
  MousePointer2,
  Search,
  Shuffle,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import PageHeaderWrapper from "../page-header-wrapper"

interface GameModesProps {
  qualificationName: string
}

export default function GameModes({ qualificationName }: GameModesProps) {
  const router = useRouter()

  const gameModes = [
    {
      id: 1,
      title: "40 pytań z teorii",
      description:
        "Pełny test teoretyczny składający się z 40 pytań. Symulacja prawdziwego egzaminu.",
      icon: BookOpen,
      difficulty: "Trudny",
      duration: "60 min",
      questions: 40,
      variant: "default" as const,
      route: "full-test",
    },
    {
      id: 2,
      title: "1 losowe pytanie",
      description:
        "Szybki test z jednym losowym pytaniem. Idealny do codziennej nauki.",
      icon: Shuffle,
      difficulty: "Łatwy",
      duration: "2 min",
      questions: 1,
      variant: "secondary" as const,
      route: "random-question",
    },
    {
      id: 3,
      title: "Przeglądanie bazy pytań",
      description:
        "Przeglądaj wszystkie dostępne pytania i odpowiedzi bez ograniczeń czasowych.",
      icon: Database,
      difficulty: "Dowolny",
      duration: "Bez limitu",
      questions: "Wszystkie",
      variant: "outline" as const,
      route: "browse-questions",
    },
  ]

  return (
    <PageHeaderWrapper
      title={`Wybierz tryb gry`}
      description={`${qualificationName}`}
      icon={<MousePointer2 />}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon

            return (
              <Link
                key={crypto.randomUUID()}
                // @ts-expect-error next.js routing ?
                href={`/dashboard/egzamin-teoretyczny/${qualificationName}/game-modes/${mode.route}`}
              >
                <Card className="flex h-full flex-col items-center p-8 transition-shadow hover:shadow-lg">
                  <div className="mb-6">
                    <IconComponent className="h-16 w-16" />
                  </div>

                  <h3 className="mb-4 text-center text-xl font-semibold">
                    {mode.title}
                  </h3>

                  <p className="text-muted-foreground mb-8 flex-grow text-center text-sm">
                    {mode.description}
                  </p>

                  <div className="text-muted-foreground mb-6 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{mode.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{mode.questions} pyt.</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    {mode.id === 3 ? (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Przeglądaj
                      </>
                    ) : (
                      "Rozpocznij"
                    )}
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/egzamin-teoretyczny")}
          >
            Powrót do kwalifikacji
          </Button>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
