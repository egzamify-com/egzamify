"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import { Calendar, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "~/components/ui/card"

export default function AllQualificationsList() {
  const router = useRouter()
  const qualificationsData = useQuery(api.teoria.query.getQualificationsList)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
    })
  }

  const handleCardClick = (qualification: any) => {
    router.push(`/dashboard/teoria/${qualification.id}/game-modes`)
  }

  if (!qualificationsData) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">Ładowanie kwalifikacji...</p>
      </div>
    )
  }

  if (qualificationsData.qualifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg">
          Brak dostępnych kwalifikacji.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualificationsData.qualifications.map((qualification) => (
        <Card
          key={qualification.id}
          className="flex cursor-pointer flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          onClick={() => handleCardClick(qualification)}
        >
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
      ))}
    </div>
  )
}
