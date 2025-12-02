"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import {
  ArrowRight,
  Award,
  BookOpen,
  FileCheck,
  Flame,
  MessageCircleIcon,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cloneElement, type ReactElement } from "react"
import CreditIcon from "~/components/credit-icon"
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
            <Card className="group relative h-full overflow-hidden border-2 transition-all duration-100 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10">
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl transition-all duration-100 group-hover:scale-150" />
              <CardHeader className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      Seria dzienna
                    </CardTitle>
                    <CardDescription className="space-y-1 text-base">
                      <p>
                        {`Codzienne rozwiązywanie krótkiego zestawu pytań z egzaminu
                      teoretycznego to najlepszy sposób, by na bieżąco sprawdzać
                      swoje postępy i redukować stres przed właściwym testem.`}
                      </p>

                      <p className="font-semibold">
                        {currentStreak > 0
                          ? "Niesamowite! Tak trzymaj"
                          : "Już dziś zacznij swoją serię!"}
                      </p>
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

            <Card className="group hover:border-border relative h-full overflow-hidden border-2 transition-all duration-100 hover:shadow-xl">
              <div className="bg-muted/30 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl transition-all duration-100 group-hover:scale-125" />
              <CardHeader className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex w-full flex-row justify-between text-2xl font-bold">
                      <h1>Kredyty Egzamify</h1>
                      <CreditIcon className="h-8 w-8" />
                    </CardTitle>
                    <CardDescription>
                      <p>
                        {`
                       Kredyty to niezbędne środki, dzięki którym możesz korzystać z zaawansowanych funkcji AI, takich jak szczegółowe wyjaśnianie pytań, analiza Twoich odpowiedzi, a także automatyczne sprawdzanie zadań z egzaminów praktycznych. 
                        `}
                      </p>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex h-full flex-col justify-between">
                <div className="flex flex-row items-center justify-start gap-2">
                  <p className="text-5xl font-bold">{userCredits}</p>
                  <CreditIcon className="h-10 w-10" />
                </div>
                <Link href="/pricing" className="mt-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group/btn w-full bg-transparent transition-all"
                  >
                    <span className="flex items-center gap-2">
                      Zarządzaj
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              {...{
                title: "Egzamin teoretyczny",
                description: `
                      Przećwicz pytania testowe ze wszystkich kwalifikacji
                      zawodowych. Nauka odbywa się w wygodnej formie quizów, trybu losowego pytania, ale możesz również spokojnie przeglądac naszą bazę pytań.
                      Sprawdzaj postępy i wzmacniaj słabsze obszary.`,
                href: "/dashboard/egzamin-teoretyczny",
                buttonText: `Rozpocznij nauke`,
                icon: <BookOpen />,
              }}
            />

            <DashboardCard
              {...{
                title: "Egzamin praktyczny",
                description: `
To najszybsza droga do nauki na realnych przykładach – AI precyzyjnie sprawdzi Twoją pracę, wykryje błędy i zasugeruje poprawki zgodnie z kluczem egzaminacyjnym. Ucz się na praktycznych przykładach i poznaj moc natychmiastowej oceny!`,
                href: "/dashboard/egzamin-praktyczny",
                buttonText: `Rozpocznij nauke`,
                icon: <FileCheck />,
              }}
            />

            <DashboardCard
              {...{
                title: "Tryby online",
                description: `
                      Rywalizuj z innymi użytkownikami w czasie rzeczywistym.
                      Sprawdzaj swoją wiedzę pod presją czasu. Dołącz do gry z znajomym i połączcie przyjemne z pożytecznym.
                      `,
                href: "/dashboard/online",
                buttonText: "Dołącz do gry",
                icon: <Wifi />,
              }}
            />

            <DashboardCard
              {...{
                title: "Statystyki",
                description: `
                      Analizuj swoje wyniki i postępy w nauce. Zobacz
                      szczegółowe dane o poprawnych i błędnych odpowiedziach.
                      Wykorzystaj statystyki, by efektywniej się uczyć.`,
                href: "/dashboard/konto",
                buttonText: "Zobacz więcej",
                icon: <Award />,
              }}
            />
            <DashboardCard
              {...{
                title: "Znajomi",
                description: `
                      Ucz się razem z innymi i motywujcie się wzajemnie. Dodawaj
                      znajomych i porównuj swoje wyniki. Nauka w grupie staje
                      się prostsza i przyjemniejsza.`,
                href: "/dashboard/friends",
                buttonText: "Otwórz",
                icon: <Users />,
              }}
            />
            <DashboardCard
              {...{
                title: "Czat AI",
                description: `
                      Korzystaj z pomocy inteligentnego asystenta. Zadawaj
                      pytania i otrzymuj szybkie wyjaśnienia. AI pomoże Ci
                      zrozumieć trudniejsze zagadnienia.`,
                href: "/dashboard/ai-wyjasnia",
                buttonText: "Rozpocznij czat",
                icon: <MessageCircleIcon />,
              }}
            />
          </div>
        </div>

        <Card className="group hover:border-border relative overflow-hidden border-2 transition-all duration-100 hover:shadow-xl md:col-span-2 lg:col-span-3">
          <div className="bg-muted/20 absolute -top-10 -left-10 h-40 w-40 rounded-full blur-3xl transition-all duration-100 group-hover:scale-125" />
          <div className="bg-muted/20 absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-3xl transition-all duration-100 group-hover:scale-125" />

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
              <div className="bg-muted ring-border inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-110">
                <TrendingUp className="text-muted-foreground h-7 w-7" />
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

function DashboardCard({
  href,
  icon,
  title,
  description,
  buttonText,
}: {
  href: string
  icon: ReactElement
  title: string
  description: string
  buttonText: string
}) {
  return (
    // @ts-expect-error blah blah next.js
    <Link href={href} className="group">
      <Card className="hover:border-border relative flex h-full flex-col justify-between overflow-hidden border-2 transition-all duration-100 hover:shadow-xl">
        <div className="bg-muted/30 absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-2xl transition-all duration-100 group-hover:scale-125" />

        <CardHeader className="relative space-y-4">
          <div className="bg-muted ring-border inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-110">
            {cloneElement(icon, {
              // @ts-expect-error blah blah, this works
              size: 40,
              className: "text-muted-foreground h-7 w-7",
            })}
          </div>

          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <Button
            variant="outline"
            size="lg"
            className="group/btn w-full bg-transparent transition-all"
          >
            <span className="flex items-center gap-2">
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
