"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import { BookOpen, CheckCircle2, Lightbulb, XCircle } from "lucide-react"

export function RecentActivity() {
  const userAnswers = useQuery(api.statistics.query.getUserStatistics)

  const activities = [
    {
      type: "success" as const,
      title: "Pytanie poprawnie rozwiązane",
      description: "Losowe pytanie - INF.02",
      time: "2 godz. temu",
      icon: CheckCircle2,
    },
    {
      type: "fail" as const,
      title: "Pytanie błędne",
      description: "Bazy danych - SQL",
      time: "4 godz. temu",
      icon: XCircle,
    },
    {
      type: "success" as const,
      title: "Sesja nauki zakończona",
      description: "45 minut intensywnej nauki",
      time: "Wczoraj",
      icon: BookOpen,
    },
    {
      type: "pending" as const,
      title: "Wyjaśnienie AI użyte",
      description: "Pytanie o protokoły sieciowe",
      time: "2 dni temu",
      icon: Lightbulb,
    },
  ]

  if (!userAnswers) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Ładowanie aktywności...</p>
      </div>
    )
  }

  if (userAnswers.totalQuestions === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Brak aktywności. Rozpocznij naukę, aby zobaczyć swoją historię!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        return (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1">
              {activity.type === "success" && (
                <Icon className="h-5 w-5 text-green-500" />
              )}
              {activity.type === "fail" && (
                <Icon className="text-destructive h-5 w-5" />
              )}
              {activity.type === "pending" && (
                <Icon className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm leading-none font-medium">
                {activity.title}
              </p>
              <p className="text-muted-foreground text-sm">
                {activity.description}
              </p>
              <p className="text-muted-foreground text-xs">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
