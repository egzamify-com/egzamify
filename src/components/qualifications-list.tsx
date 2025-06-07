"use client"
import { Card, CardContent } from "~/components/ui/card"
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

interface QualificationsListProps {
  qualifications: Qualification[]
}

export default function QualificationsList({ qualifications }: QualificationsListProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "Machine Learning":
        return <Brain className="h-6 w-6" />
      case "Deep Learning":
        return <Network className="h-6 w-6" />
      case "NLP":
        return <Code className="h-6 w-6" />
      case "Computer Vision":
        return <LineChart className="h-6 w-6" />
      default:
        return <Database className="h-6 w-6" />
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
    <div className="space-y-4">
      {qualifications.map((qualification) => (
        <Card key={qualification.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-6">
              <div className="mr-4 flex-shrink-0 p-2 bg-gray-100 rounded-md">{getIcon(qualification.category)}</div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{qualification.title}</h3>
                  <Badge
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
                <p className="text-sm text-gray-500 mt-1">{qualification.description}</p>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>{qualification.questionsCount} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(qualification.releaseDate)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{qualification.category}</Badge>
                  {qualification.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
