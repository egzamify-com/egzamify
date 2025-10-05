"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  Loader2,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { RecentActivity } from "~/components/dashboard/recent-activity"
import { StatsChart } from "~/components/dashboard/stats-chart"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export default function DashboardPage() {
  const user = useQuery(api.users.query.getCurrentUser)
  const userStats = useQuery(api.statistics.query.getUserStatistics)
  const weeklyProgress = useQuery(api.statistics.query.getWeeklyProgress)

  if (
    user === undefined ||
    userStats === undefined ||
    weeklyProgress === undefined
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) return redirect("/sign-in")

  const currentStreak = user.daily_streak || 0

  return (
    <div className="bg-background min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Witaj z powrotem, {user.username}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Kontynuuj swoją przygodę z przygotowaniami do egzaminu zawodowego
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Twoje postępy
              </CardTitle>
              <CardDescription>Statystyki z ostatnich 7 dni</CardDescription>
            </CardHeader>
            <CardContent>
              <StatsChart weeklyData={weeklyProgress} totalStats={userStats} />
            </CardContent>
          </Card>
          <Link href="/dashboard/teoria" className="group">
            <Card className="hover:border-primary h-fit transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <Target className="text-muted-foreground h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Egzamin Teoretyczny
                </CardTitle>
                <CardDescription>Pytania i kwalifikacje</CardDescription>
                <Button className="mt-4 w-full" variant="secondary">
                  Rozpocznij naukę
                </Button>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/ai-wyjasnia" className="group">
            <Card className="hover:border-primary h-fit transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                  <span className="text-muted-foreground text-xs font-semibold">
                    AI
                  </span>
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

          <Link href="/dashboard/friends" className="group">
            <Card className="hover:border-primary h-fit transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-green-500" />
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold">
                    Nowe
                  </span>
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

          <Link href="/dashboard/konto" className="group">
            <Card className="hover:border-primary h-fit transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-orange-500" />
                  <span className="text-muted-foreground text-sm font-semibold">
                    STATS
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Statystyki
                </CardTitle>
                <CardDescription>Twoje wyniki</CardDescription>
                <Button className="mt-4 w-full" variant="secondary">
                  Zobacz statystyki
                </Button>
              </CardHeader>
            </Card>
          </Link>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                Ostatnia aktywność
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>

          {currentStreak > 0 && (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 md:col-span-2 lg:col-span-3">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Twoja passa
                  </p>
                  <p className="flex items-center gap-2 text-3xl font-bold">
                    {currentStreak} {currentStreak === 1 ? "dzień" : "dni"}
                    <Flame className="h-8 w-8 text-orange-500" />
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Świetna robota! Kontynuuj naukę
                  </p>
                </div>
                <div className="flex gap-2">
                  {[...Array(Math.min(currentStreak, 7))].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-orange-400 bg-orange-100"
                    >
                      <span className="text-xl">✓</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
