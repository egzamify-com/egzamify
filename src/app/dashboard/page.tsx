"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import {
  Award,
  BookOpen,
  Coins,
  FileCheck,
  Flame,
  MessageSquare,
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

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Twoje kredyty</CardTitle>
                <Coins className="h-8 w-8" />
              </div>
              <CardDescription className="pt-4">
                Dostępnych kredytów
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-4xl font-bold">{userCredits}</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/konto">Zarządzaj kredytami</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Seria dzienna</CardTitle>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <CardDescription className="pt-4">
                {currentStreak > 0
                  ? "Świetna robota! Kontynuuj naukę"
                  : "Rozpocznij swoją serię już dziś!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-4xl font-bold">
                  {currentStreak} {currentStreak === 1 ? "dzień" : "dni"}
                </p>

                {currentStreak > 0 && (
                  <div className="flex gap-2">
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

          <Link href="/dashboard/egzamin-teoretyczny" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Egzamin teoretyczny
                  </CardTitle>
                  <BookOpen className="h-8 w-8" />
                </div>
                <CardDescription className="pt-4">
                  Pytania testowe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Rozpocznij
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="lg:col-span-2 lg:row-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Twoje postępy</CardTitle>
                <TrendingUp className="h-8 w-8" />
              </div>
              <CardDescription className="pt-2">
                Statystyki z ostatnich 7 dni
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <StatsChart weeklyData={weeklyProgress} totalStats={userStats} />
            </CardContent>
          </Card>

          <Link href="/dashboard/egzamin-praktyczny" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Egzamin praktycznyy
                  </CardTitle>
                  <FileCheck className="h-8 w-8" />
                </div>
                <CardDescription className="pt-4">
                  Projekty egzaminacyjne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Rozpocznij
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* AI WYJAŚNIA */}
          <Link href="/dashboard/ai-wyjasnia" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    AI Wyjaśnia
                  </CardTitle>
                  <MessageSquare className="h-8 w-8" />
                </div>
                <CardDescription className="pt-4">
                  Zadaj pytanie AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Rozpocznij chat
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* STATYSTYKI */}
          <Link href="/dashboard/konto" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Statystyki
                  </CardTitle>
                  <Award className="h-8 w-8" />
                </div>
                <CardDescription className="pt-4">
                  Szczegółowe wyniki
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Zobacz statystyki
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* ZNAJOMI */}
          <Link href="/dashboard/friends" className="group">
            <Card className="hover:border-primary h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Znajomi
                  </CardTitle>
                  <Users className="h-8 w-8" />
                </div>
                <CardDescription className="pt-4">
                  Ucz się razem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Zobacz znajomych
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
