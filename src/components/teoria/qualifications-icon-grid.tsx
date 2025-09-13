"use client"

import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Brain, Code, Database, LineChart, Network, Calendar, HelpCircle } from "lucide-react"

interface Qualification {
  id: number
  title: string
  description: string
  category: string
  level: string
  skills: string[]
  image: string
  questionsCount: number
  releaseDate: string
}

interface QualificationsIconGridProps {
  qualifications: Qualification[]
}

export default function QualificationsIconGrid({ qualifications }: QualificationsIconGridProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "Machine Learning":
        return <Brain className="h-12 w-12" />
      case "Deep Learning":
        return <Network className="h-12 w-12" />
      case "NLP":
        return <Code className="h-12 w-12" />
      case "Computer Vision":
        return <LineChart className="h-12 w-12" />
      default:
        return <Database className="h-12 w-12" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  if (qualifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No qualifications found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qualifications.map((qualification) => (
        <Card key={qualification.id} className="overflow-hidden flex flex-col">
          <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
            <div className="text-gray-600">{getIcon(qualification.category)}</div>
            <Badge
              className="absolute top-2 right-2"
              variant={
                qualification.level === "Beginner"
                  ? "outline"
                  : qualification.level === "Intermediate"
                    ? "secondary"
                    : qualification.level === "Advanced"
                      ? "default"
                      : "destructive"
              }
            >
              {qualification.level}
            </Badge>
          </div>
          <CardContent className="pt-4 flex-grow">
            <h3 className="text-lg font-semibold">{qualification.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{qualification.description}</p>

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>{qualification.questionsCount} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(qualification.releaseDate)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 pt-0 pb-4">
            <Badge variant="outline">{qualification.category}</Badge>
            {qualification.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {qualification.skills.length > 2 && <Badge variant="secondary">+{qualification.skills.length - 2}</Badge>}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
