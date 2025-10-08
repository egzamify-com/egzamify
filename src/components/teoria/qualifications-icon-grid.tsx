"use client"

import {
  Brain,
  Calendar,
  Code,
  Database,
  HelpCircle,
  LineChart,
  Network,
} from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardFooter } from "~/components/ui/card"

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

export default function QualificationsIconGrid({
  qualifications,
}: QualificationsIconGridProps) {
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
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg">
          No qualifications found matching your criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualifications.map((qualification) => (
        <Card key={qualification.id} className="flex flex-col overflow-hidden">
          <div className="relative flex h-32 items-center justify-center">
            <div className="text-muted-foreground">
              {getIcon(qualification.category)}
            </div>
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
          <CardContent className="flex-grow pt-4">
            <h3 className="text-lg font-semibold">{qualification.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {qualification.description}
            </p>

            <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
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
            {qualification.skills.length > 2 && (
              <Badge variant="secondary">
                +{qualification.skills.length - 2}
              </Badge>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
