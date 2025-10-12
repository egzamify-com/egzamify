"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { Calendar, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "~/components/ui/card"
import FullScreenError from "../full-screen-error"
import FullScreenLoading from "../full-screen-loading"

export default function AllQualificationsList() {
  const {
    data: qualificationsData,
    isPending,
    error,
  } = useQuery(api.teoria.query.getQualificationsList)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
    })
  }

  if (isPending) <FullScreenLoading />

  if (
    (qualificationsData && qualificationsData.qualifications.length === 0) ||
    error
  ) {
    console.error("[QUALIFICATIONS] Brak kwalifikacji (?)")
    return (
      <FullScreenError
        type="warning"
        errorDetail={error?.message}
        errorMessage="Brak kwalifikacji, przepraszamy."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualificationsData?.qualifications.map((qualification) => (
        <Link
          href={`/dashboard/egzamin-teoretyczny/${qualification.name}/game-modes`}
          key={crypto.randomUUID()}
        >
          <Card className="flex cursor-pointer flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <div className="relative h-40 bg-gray-200">
              <img
                src={"/placeholder.svg"}
                alt={qualification.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="flex-grow pt-4">
              <h3 className="hover:text-muted-foreground text-lg font-semibold transition-colors">
                {qualification.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {qualification.label}
              </p>

              <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  <span>{qualification.questionsCount} pytań</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(qualification.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
