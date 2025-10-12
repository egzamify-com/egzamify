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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "../page-header-wrapper"

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
      icon={<MousePointer2 size={pageHeaderWrapperIconSize} />}
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
                <Card className="group relative cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className={`absolute top-0 right-0 left-0 h-1`} />

                  <CardHeader className="pb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className={`bg-opacity-10 rounded-lg p-3`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-muted-foreground text-xl transition-colors">
                      {mode.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {mode.description}
                    </p>

                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{mode.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{mode.questions} pytań</span>
                      </div>
                    </div>

                    <Button className="mt-4 w-full" variant={"outline"}>
                      {mode.id === 3 ? (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Przeglądaj
                        </>
                      ) : (
                        "Rozpocznij"
                      )}
                    </Button>
                  </CardContent>
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
