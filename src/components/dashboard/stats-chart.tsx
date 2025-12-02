"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface StatsChartProps {
  weeklyData: Array<{
    day: string
    questions: number
    correct: number
    time: number
  }>
  totalStats: {
    totalQuestions: number
    correctAnswers: number
    averageAccuracy: number
    totalStudyTime: number
    aiExplanationsUsed: number
  } | null
}

const CustomTooltip = ({ active, payload }: any) => {
  //naprawiony eeror
  if (active && payload?.length) {
    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground text-sm font-medium">
          Pytania: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function StatsChart({ weeklyData, totalStats }: StatsChartProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Rozwiązane pytania</p>
          <p className="text-2xl font-bold">
            {totalStats?.totalQuestions || 0}
          </p>
          <p className="text-muted-foreground text-xs">Wszystkie odpowiedzi</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Poprawne odpowiedzi</p>
          <p className="text-2xl font-bold">
            {totalStats?.correctAnswers || 0}
          </p>
          <p className="text-muted-foreground text-xs">Bezbłędne</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Skuteczność nauki</p>
          <p className="text-2xl font-bold">
            {totalStats?.averageAccuracy || 0}%
          </p>
          <p className="text-muted-foreground text-xs">Średnia trafność</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyData}>
          <XAxis
            dataKey="day"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          <Bar
            dataKey="questions"
            radius={[8, 8, 0, 0]}
            fill="hsl(var(--muted-foreground))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
