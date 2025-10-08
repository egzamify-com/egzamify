"use client"

import {
  BookOpen,
  Clock,
  Database,
  Search,
  Shuffle,
  Target,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface GameModesProps {
  qualificationId: string
}

export default function GameModes({ qualificationId }: GameModesProps) {
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

  const handleModeSelect = (mode: (typeof gameModes)[0]) => {
    // @ts-expect-error fix todo
    router.push(`/dashboard/teoria/${qualificationId}/game-modes/${mode.route}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Wybierz tryb gry</h1>
        <p className="text-muted-foreground">Kwalifikacja: {qualificationId}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {gameModes.map((mode) => {
          const IconComponent = mode.icon

          return (
            <Card
              key={mode.id}
              className="group relative cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              onClick={() => handleModeSelect(mode)}
            >
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

                <Button
                  className="group-hover:text-muted-foreground mt-4 w-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModeSelect(mode)
                  }}
                >
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
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/teoria")}
        >
          Powrót do kwalifikacji
        </Button>
      </div>
    </div>
  )
}
