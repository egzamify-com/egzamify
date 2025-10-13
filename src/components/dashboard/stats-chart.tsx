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

export function StatsChart({ weeklyData, totalStats }: StatsChartProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Rozwiązane</p>
          <p className="text-2xl font-bold">
            {totalStats?.totalQuestions || 0}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Poprawne</p>
          <p className="text-2xl font-bold">
            {totalStats?.correctAnswers || 0}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Skuteczność</p>
          <p className="text-2xl font-bold">
            {totalStats?.averageAccuracy || 0}%
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyData}>
          <XAxis
            dataKey="day"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="questions" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
