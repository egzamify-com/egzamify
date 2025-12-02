"use client"

import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/react"
import {
  ArrowRight,
  BookOpen,
  CircleQuestionMark,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface QualificationData {
  qualification: Doc<"qualifications">
  questionsCount: number
  baseExams: Doc<"basePracticalExams">[]
}

export default function AllQualificationsList({
  searchTerm,
}: {
  searchTerm: string
}) {
  const qualificationsData = useQuery(api.teoria.query.getQualificationsList, {
    search: searchTerm,
  })

  const qualifications: QualificationData[] =
    qualificationsData?.qualifications || []

  if (qualificationsData === undefined) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="group from-card/50 via-card to-card/80 relative overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm"
          >
            <div className="from-primary/5 to-accent/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-200" />
            <CardHeader className="space-y-4 pb-4">
              <div className="flex items-start justify-between">
                <div className="bg-muted/50 h-12 w-12 animate-pulse rounded-xl" />
                <div className="bg-muted/50 h-8 w-16 animate-pulse rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 h-6 w-3/4 animate-pulse rounded" />
                <div className="bg-muted/50 h-4 w-1/2 animate-pulse rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 h-24 animate-pulse rounded-lg" />
            </CardContent>
            <CardFooter>
              <div className="bg-muted/50 h-10 w-full animate-pulse rounded-lg" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (qualifications.length === 0 && searchTerm) {
    return (
      <Card className="border-border/50 from-card via-muted/20 to-card col-span-full border-2 border-dashed bg-gradient-to-br">
        <CardContent className="py-16 text-center">
          <div className="bg-muted/50 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
            <BookOpen className="text-muted-foreground h-10 w-10" />
          </div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-balance">
            Brak wyników
          </h2>
          <p className="text-muted-foreground mb-6 text-pretty">
            Nie znaleziono kwalifikacji pasujących do {`"`}
            <strong className="text-foreground">{searchTerm}</strong>
            {`"`}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Odśwież
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (qualifications.length === 0) {
    return (
      <Card className="border-border/50 from-card via-muted/20 to-card col-span-full border-2 border-dashed bg-gradient-to-br">
        <CardContent className="py-16 text-center">
          <div className="bg-muted/50 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
            <BookOpen className="text-muted-foreground h-10 w-10" />
          </div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-balance">
            Brak dostępnych kwalifikacji
          </h2>
          <p className="text-muted-foreground text-pretty">
            Przepraszamy, ale aktualnie nie ma dostępnych kwalifikacji do nauki.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualifications.map((data: QualificationData) => {
        return (
          <Card
            key={data.qualification._id}
            className="group from-card/80 via-card to-card/60 relative flex flex-col overflow-hidden bg-gradient-to-br shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10"
          >
            <div className="from-primary/5 to-primary/3 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-200" />

            <div className="from-primary/10 to-primary/5 absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-200" />
            <div className="bg-card absolute inset-[1px] rounded-lg" />

            <CardHeader className="relative z-10 space-y-4 pb-4">
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className="text-muted-foreground absolute inset-0 opacity-20 blur-xl transition-all duration-200 group-hover:opacity-40" />
                  <div className="from-background to-muted/50 relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                    <BookOpen className="text-muted-foreground group-hover:text-foreground h-6 w-6 transition-colors duration-200" />
                  </div>
                </div>

                <div className="from-primary/10 to-primary/5 ring-primary/10 group-hover:ring-primary/20 flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1.5 shadow-sm ring-1 transition-all duration-200">
                  <CircleQuestionMark className="text-primary h-3.5 w-3.5" />
                  <span className="text-primary text-xs font-semibold">
                    {data.questionsCount}
                  </span>
                </div>
              </div>

              <div>
                <CardTitle className="group-hover:text-primary text-xl leading-tight tracking-tight text-balance transition-colors duration-200">
                  {data.qualification.name}
                </CardTitle>

                {data.qualification.label &&
                  data.qualification.label !== data.qualification.name && (
                    <p className="text-muted-foreground group-hover:text-primary/70 mt-1 text-sm transition-colors duration-200">
                      {data.qualification.label}
                    </p>
                  )}
              </div>
            </CardHeader>

            <div className="relative mx-6 h-px">
              <div className="via-border absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
              <div className="via-primary/20 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-200" />
            </div>

            <CardFooter className="relative z-10 mt-auto flex justify-end pt-6">
              <Link
                href={{
                  pathname: `/dashboard/egzamin-teoretyczny/${data.qualification.name}/game-modes`,
                }}
                className="w-full"
              >
                <Button className="group/btn from-primary to-primary/90 shadow-primary/20 hover:shadow-primary/30 relative w-full overflow-hidden bg-gradient-to-r shadow-xs transition-all duration-200 hover:shadow-lg">
                  <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                    Rozpocznij naukę
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </span>
                  <div className="from-primary/0 via-primary-foreground/10 to-primary/0 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-200 group-hover/btn:opacity-200" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
