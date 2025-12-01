"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import {
  ArrowRight,
  Award,
  BookOpen,
  Coins,
  FileCheck,
  Flame,
  Sparkles,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { StatsChart } from "~/components/dashboard/stats-chart"
import FullScreenLoading from "~/components/full-screen-loading"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export default function DashboardPage() {
  const { data: user } = useQuery(api.users.query.getCurrentUser)
  const { data: userStats } = useQuery(api.statistics.query.getUserStatistics)
  const { data: weeklyProgress } = useQuery(
    api.statistics.query.getWeeklyProgress,
  )

  if (
    user === undefined ||
    userStats === undefined ||
    weeklyProgress === undefined
  ) {
    return <FullScreenLoading />
  }

  if (!user) return redirect("/sign-in")

  const currentStreak = user.daily_streak ?? 0
  const userCredits = user.credits ?? 0

  return (
    <div className="bg-background relative min-h-screen overflow-hidden p-4 md:p-8">
      <div className="relative mx-auto max-w-[1600px] space-y-8">
        <div className="space-y-3">
          <div className="border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            Dashboard
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Cześć,{" "}
            <span className="from-foreground to-foreground/60 bg-gradient-to-r bg-clip-text text-transparent">
              {user.username}
            </span>
          </h1>
          <p className="text-muted-foreground text-xl text-balance md:text-2xl">
            Gotowy na kolejny dzień nauki?
          </p>
        </div>

        <div className="space-y-4">
          {" "}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10">
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl transition-all duration-500 group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Seria dzienna
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {currentStreak > 0
                        ? "Niesamowite! Tak trzymaj"
                        : "Zacznij dzisiaj swoją serię"}
                    </CardDescription>
                  </div>
                  <div className="rounded-xl bg-orange-500/10 p-3 ring-1 ring-orange-500/20">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <p className="text-6xl font-bold tracking-tighter">
                    {currentStreak}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {currentStreak === 1 ? "dzień" : "dni z rzędu"}
                  </p>
                </div>

                {currentStreak > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(Math.min(currentStreak, 7))].map((_, i) => (
                      <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-orange-500/20 bg-orange-500/5 text-orange-500 transition-all hover:scale-110 hover:border-orange-500/40 hover:bg-orange-500/10"
                      >
                        <Flame className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="group hover:border-border relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
              <div className="bg-muted/30 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125" />
              <CardHeader className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Kredyty
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Dostępne środki
                    </CardDescription>
                  </div>
                  <div className="bg-muted ring-border rounded-xl p-3 ring-1">
                    <Coins className="text-muted-foreground h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-bold tracking-tighter">
                    {userCredits}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/link"
                    asChild
                  >
                    <Link href="/pricing">
                      Zarządzaj
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/egzamin-teoretyczny" className="group">
              <Card className="hover:border-border relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <div className="bg-muted/30 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125" />

                <CardHeader className="relative space-y-4">
                  <div className="bg-muted ring-border inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="text-muted-foreground h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Egzamin teoretyczny
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Pytania testowe z wszystkich kwalifikacji zawodowych
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <Button size="lg" className="group/btn w-full transition-all">
                    <span className="flex items-center gap-2">
                      Rozpocznij naukę
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/egzamin-praktyczny" className="group">
              <Card className="hover:border-border relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <div className="bg-muted/30 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125" />

                <CardHeader className="relative space-y-4">
                  <div className="bg-muted ring-border inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110">
                    <FileCheck className="text-muted-foreground h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Egzamin praktyczny
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Projekty egzaminacyjne z poprzednich lat
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group/btn w-full bg-transparent transition-all"
                  >
                    <span className="flex items-center gap-2">
                      Przejdź do projektów
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/online" className="group">
              <Card className="hover:border-border relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <div className="bg-muted/30 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125" />

                <CardHeader className="relative space-y-4">
                  <div className="bg-muted ring-border inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110">
                    <Wifi className="text-muted-foreground h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Tryby Online
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Rywalizuj z innymi w czasie rzeczywistym
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group/btn w-full bg-transparent transition-all"
                  >
                    <span className="flex items-center gap-2">
                      Dołącz do gry
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/konto" className="group">
              <Card className="hover:border-border h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold">
                        Statystyki
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Szczegóły konta
                      </CardDescription>
                    </div>
                    <div className="bg-muted ring-border rounded-lg p-3 ring-1">
                      <Award className="text-muted-foreground h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group/link w-full bg-transparent"
                  >
                    Zobacz więcej
                    <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/friends" className="group">
              <Card className="hover:border-border h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold">
                        Znajomi
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Nauka w grupie
                      </CardDescription>
                    </div>
                    <div className="bg-muted ring-border rounded-lg p-3 ring-1">
                      <Users className="text-muted-foreground h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group/link w-full bg-transparent"
                  >
                    Otwórz
                    <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/ai-wyjasnia" className="group">
              <Card className="hover:border-border relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
                <div className="bg-muted/30 absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125" />
                <CardHeader className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Sparkles className="h-5 w-5" />
                        AI Wyjaśnia
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Zapytaj asystenta AI
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group/link w-full bg-transparent transition-all"
                  >
                    Rozpocznij chat
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <Card className="hover:border-border relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl md:col-span-2 lg:col-span-3">
          <div className="bg-muted/20 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold">
                  Twoje postępy
                </CardTitle>
                <CardDescription className="text-base">
                  Ostatnie 7 dni aktywności
                </CardDescription>
              </div>
              <div className="bg-muted ring-border rounded-xl p-3 ring-1">
                <TrendingUp className="text-muted-foreground h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative h-[300px]">
            <StatsChart weeklyData={weeklyProgress} totalStats={userStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
