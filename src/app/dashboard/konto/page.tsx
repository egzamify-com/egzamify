"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Loader2,
  Settings,
  Target,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"

interface WeeklyProgressData {
  day: string
  fullDay: string
  questions: number
  correct: number
  time: number
}

const WeeklyProgressCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WeeklyProgressData
    const fullDayName = data.fullDay || label

    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground mb-1 text-sm font-bold">{fullDayName}</p>
        <p className="text-foreground text-sm">
          Pytania: <span className="font-bold">{data.questions}</span>
        </p>
        <p className="text-foreground text-sm">
          Poprawne: <span className="font-bold">{data.correct}</span>
        </p>
      </div>
    )
  }
  return null
}

interface QualificationStatsData {
  name: string
  completed: number
  correct: number
  accuracy: number
}

const QualificationStatsCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as QualificationStatsData

    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground mb-1 text-sm font-bold">{label}</p>
        <p className="text-foreground text-sm">
          Skuteczność: <span className="font-bold">{data.accuracy}%</span>
        </p>
      </div>
    )
  }
  return null
}

interface MonthlyTrendData {
  month: string
  fullMonth: string
  questions: number
  accuracy: number
}

const MonthlyTrendsCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonthlyTrendData
    const fullMonthName = data.fullMonth || label

    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground mb-1 text-sm font-bold">
          {fullMonthName}
        </p>
        <p className="text-foreground text-sm">
          Pytania: <span className="font-bold">{data.questions}</span>
        </p>
        <p className="text-foreground text-sm">
          Skuteczność: <span className="font-bold">{data.accuracy}%</span>
        </p>
      </div>
    )
  }
  return null
}

interface StudyPatternsData {
  time: string
  rawHour: number
  sessions: number
}

const StudyPatternsCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as StudyPatternsData

    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground mb-1 text-sm font-bold">
          Godzina: <span className="font-normal">{data.time}</span>{" "}
        </p>
        <p className="text-foreground text-sm">
          Sesje: <span className="font-bold">{data.sessions}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function StatisticsPage() {
  const user = useQuery(api.users.query.getCurrentUser)
  const userStats = useQuery(api.statistics.query.getUserStatistics)
  const weeklyProgress = useQuery(api.statistics.query.getWeeklyProgress)
  const qualificationStats = useQuery(
    api.statistics.query.getQualificationStats,
  )
  const monthlyTrend = useQuery(api.statistics.query.getMonthlyTrends)
  const studyPatterns = useQuery(api.statistics.query.getStudyPatterns)
  const skillRadar = useQuery(api.statistics.query.getSkillRadar)
  const difficultyBreakdown = useQuery(
    api.statistics.query.getDifficultyBreakdown,
  )

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (
    user === undefined ||
    userStats === undefined ||
    weeklyProgress === undefined ||
    qualificationStats === undefined ||
    monthlyTrend === undefined ||
    studyPatterns === undefined ||
    skillRadar === undefined ||
    difficultyBreakdown === undefined
  ) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) return redirect("/sign-in")

  return (
    <div className="space-y-6 px-10 pt-10 pb-16">
      <Card className="group border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <ActivityStatusAvatar size={55} />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
            </div>

            <Link href={`/user/${user.username}`}>
              <Button
                variant="outline"
                className="border-border/40 hover:border-border/60 bg-transparent transition-all duration-300"
              >
                <User className="mr-2 h-4 w-4" /> Public profile
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="outline"
                className="border-border/40 hover:border-border/60 bg-transparent transition-all duration-300"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {userStats ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Rozwiązane pytania
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {userStats.totalQuestions.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-muted/50 group-hover:bg-muted flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
                    <BookOpen className="text-muted-foreground group-hover:text-foreground h-6 w-6 transition-colors duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Skuteczność
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {userStats.averageAccuracy}%
                    </p>
                  </div>
                  <div className="bg-muted/50 group-hover:bg-muted flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
                    <Target className="text-muted-foreground group-hover:text-foreground h-6 w-6 transition-colors duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Czas nauki
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {formatTime(userStats.totalStudyTime)}
                    </p>
                  </div>
                  <div className="bg-muted/50 group-hover:bg-muted flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
                    <Clock className="text-muted-foreground group-hover:text-foreground h-6 w-6 transition-colors duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-muted-foreground h-5 w-5" />
                Postęp w tym tygodniu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyProgress}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                  />
                  <XAxis dataKey="day" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    content={<WeeklyProgressCustomTooltip />}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="questions"
                    stackId="1"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted-foreground))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="correct"
                    stackId="2"
                    stroke="hsl(var(--foreground))"
                    fill="hsl(var(--foreground))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
            <Card className="border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-muted-foreground h-5 w-5" />
                  Wyniki na kwalifikacje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualificationStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/40"
                    />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      content={<QualificationStatsCustomTooltip />}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="accuracy"
                      fill="hsl(var(--muted-foreground))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 bg-card/50 hover:border-border/60 mt-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-5 w-5" />
                Trendy miesięczne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                  />
                  <XAxis dataKey="month" className="text-muted-foreground" />

                  <YAxis yAxisId="left" className="text-muted-foreground" />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-muted-foreground"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={<MonthlyTrendsCustomTooltip />}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="questions"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 hover:border-border/60 mt-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-5 w-5" />
                Wzorce nauki (godziny)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={studyPatterns}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/40"
                  />
                  <XAxis dataKey="time" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    content={<StudyPatternsCustomTooltip />}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted-foreground))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="text-muted-foreground h-5 w-5" />
                  Osiągnięcia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-border/40 bg-muted/30 flex items-center justify-between rounded-lg border p-4">
                  <span className="text-sm font-medium">Wyjaśnienia AI</span>
                  <span className="text-2xl font-bold">
                    {userStats.aiExplanationsUsed}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="text-muted-foreground h-5 w-5" />
                  Postęp do celu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Skuteczność 80%
                    </span>
                    <span className="font-semibold">
                      {userStats.averageAccuracy}%
                    </span>
                  </div>
                  <Progress value={userStats.averageAccuracy} className="h-2" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">1000 pytań</span>
                    <span className="font-semibold">
                      {userStats.totalQuestions}
                    </span>
                  </div>
                  <Progress
                    value={(userStats.totalQuestions / 1000) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 hover:border-border/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="text-muted-foreground h-5 w-5" />
                  Aktywność
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-border/40 bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <CheckCircle className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Poprawne odpowiedzi</p>
                    <p className="text-xl font-bold">
                      {userStats.correctAnswers}
                    </p>
                  </div>
                </div>
                <div className="border-border/40 bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <XCircle className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Błędne odpowiedzi</p>
                    <p className="text-xl font-bold">
                      {userStats.totalQuestions - userStats.correctAnswers}
                    </p>
                  </div>
                </div>
                <div className="border-border/40 bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Lightbulb className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Użyte wyjaśnienia</p>
                    <p className="text-xl font-bold">
                      {userStats.aiExplanationsUsed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              Brak danych statystycznych. Zacznij rozwiązywać pytania!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
