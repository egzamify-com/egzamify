"use client"

import {
  ArrowRight,
  BookOpen,
  CircleQuestionMark,
  Clock,
  Database,
  MousePointer2,
  Search,
  Shuffle,
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon

            const getQuestionText = (
              modeId: number,
              questions: number | string,
            ) => {
              switch (modeId) {
                case 1:
                  return `${questions} pytań`
                case 2:
                  return `${questions} pytanie`
                case 3:
                  return `${questions} pytania`
                default:
                  return `${questions} pyt.`
              }
            }

            return (
              <Link
                key={crypto.randomUUID()}
                // @ts-expect-error next.js routing ?
                href={`/dashboard/egzamin-teoretyczny/${qualificationName}/game-modes/${mode.route}`}
                className="group"
              >
                <Card className="from-card/80 via-card to-card/60 relative flex h-full flex-col overflow-hidden bg-gradient-to-br p-8 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10">
                  <div className="from-primary/5 to-primary/3 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="from-primary/10 to-primary/5 absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="bg-card absolute inset-[1px] rounded-lg" />

                  <div className="relative z-10 mb-8">
                    <div className="relative mx-auto w-fit">
                      <div className="absolute inset-0 opacity-20 blur-xl transition-all duration-200 group-hover:opacity-40" />
                      <div className="from-background to-muted/50 relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:rotate-3">
                        <IconComponent className="text-muted-foreground group-hover:text-foreground h-10 w-10 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>

                  <h3 className="group-hover:text-primary relative z-10 mb-4 text-center text-2xl font-bold tracking-tight text-balance transition-colors duration-300">
                    {mode.title}
                  </h3>

                  <p className="text-muted-foreground relative z-10 mb-8 flex-grow text-center text-sm leading-relaxed text-pretty">
                    {mode.description}
                  </p>

                  <div className="relative z-10 mx-auto mb-6 h-px w-24">
                    <div className="via-border absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
                    <div className="via-primary/30 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>

                  <div className="text-muted-foreground relative z-10 mb-8 flex items-center justify-center gap-6 text-sm">
                    <div className="group-hover:text-foreground flex items-center gap-2 transition-colors duration-300">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{mode.duration}</span>
                    </div>
                    <div className="bg-border h-4 w-px" />
                    <div className="group-hover:text-foreground flex items-center gap-2 transition-colors duration-300">
                      <CircleQuestionMark className="h-4 w-4" />
                      <span className="font-medium">
                        {getQuestionText(mode.id, mode.questions)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="group/btn from-primary to-primary/90 shadow-primary/20 hover:shadow-primary/30 relative z-10 w-full overflow-hidden bg-gradient-to-r shadow-xs transition-all duration-200 hover:shadow-lg"
                    variant="default"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                      {mode.id === 3 ? (
                        <>
                          <Search className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                          Przeglądaj
                        </>
                      ) : (
                        <>
                          Rozpocznij
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="from-primary/0 via-primary-foreground/10 to-primary/0 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/egzamin-teoretyczny")}
            className="gap-2 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            Powrót do kwalifikacji
          </Button>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
