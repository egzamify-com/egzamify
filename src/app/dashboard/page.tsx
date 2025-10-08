"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import {
  Award,
  BookOpen,
  Clock,
  Coins,
  FileCheck,
  Flame,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
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
    <div className="bg-background min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Powitanie */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Witaj z powrotem, {user.username}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Kontynuuj swoją przygodę z przygotowaniami do egzaminu zawodowego
          </p>
        </div>

        {/* GÓRNY RZĄD: Seria dzienna + Kredyty */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* SERIA DZIENNY STREAK */}
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Seria dzienna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">
                      {currentStreak} {currentStreak === 1 ? "dzień" : "dni"}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {currentStreak > 0
                        ? "Świetna robota! Kontynuuj naukę"
                        : "Rozpocznij swoją serię już dziś!"}
                    </p>
                  </div>
                  <Flame className="h-16 w-16 text-orange-500" />
                </div>

                {currentStreak > 0 && (
                  <div className="flex gap-2 pt-2">
                    {[...Array(Math.min(currentStreak, 7))].map((_, i) => (
                      <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border-2"
                      >
                        <span className="text-lg">✓</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* TWOJE KREDYTY */}
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-6 w-6" />
                Twoje kredyty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">{userCredits}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Dostępnych kredytów
                    </p>
                  </div>
                  <Coins className="h-16 w-16" />
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href="/dashboard/konto">Zarządzaj kredytami</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ŚRODKOWY RZĄD: Statystyki (duży) + Egzaminy */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* STATYSTYKI - duży box */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Twoje postępy
              </CardTitle>
              <CardDescription>Statystyki z ostatnich 7 dni</CardDescription>
            </CardHeader>
            <CardContent>
              <StatsChart weeklyData={weeklyProgress} totalStats={userStats} />
            </CardContent>
          </Card>

          {/* EGZAMINY - 2 karty w kolumnie */}
          <div className="flex flex-col gap-4">
            {/* EGZAMIN TEORETYCZNY */}
            <Link href="/dashboard/teoria" className="group flex-1">
              <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8" />
                    <Target className="text-muted-foreground h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Egzamin teoretyczny
                  </CardTitle>
                  <CardDescription>Pytania testowe</CardDescription>
                  <Button className="mt-4 w-full" variant="secondary">
                    Rozpocznij
                  </Button>
                </CardHeader>
              </Card>
            </Link>

            {/* EGZAMIN PRAKTYCZNY */}
            <Link href="/dashboard/egzamin-praktyczny" className="group flex-1">
              <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <FileCheck className="h-8 w-8" />
                    <Clock className="text-muted-foreground h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Egzamin praktyczny
                  </CardTitle>
                  <CardDescription>Projekty egzaminacyjne</CardDescription>
                  <Button className="mt-4 w-full" variant="secondary">
                    Rozpocznij
                  </Button>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/friends" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Znajomi
                </CardTitle>
                <CardDescription>Ucz się razem</CardDescription>
                <Button className="mt-4 w-full" variant="secondary">
                  Zobacz znajomych
                </Button>
              </CardHeader>
            </Card>
          </Link>

          {/* STATYSTYKI - link do pełnej strony */}
          <Link href="/dashboard/konto" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Statystyki
                </CardTitle>
                <CardDescription>Szczegółowe wyniki</CardDescription>
                <Button className="mt-4 w-full" variant="secondary">
                  Zobacz statystyki
                </Button>
              </CardHeader>
            </Card>
          </Link>

          {/* AI WYJAŚNIA */}
          <Link href="/dashboard/ai-wyjasnia" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  AI Wyjaśnia
                </CardTitle>
                <CardDescription>Zadaj pytanie AI</CardDescription>
                <Button className="mt-4 w-full" variant="secondary">
                  Rozpocznij chat
                </Button>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
