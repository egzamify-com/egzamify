"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Filter, Loader2, Search } from "lucide-react"
import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import PageHeaderWrapper from "../page-header-wrapper"

export default function BrowseQuestions({
  qualificationName,
}: {
  qualificationName: string
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  )
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const questionsData = useQuery(api.teoria.query.getBrowseQuestions, {
    qualificationName,
    search: searchTerm || undefined,
    year: selectedYear,
    limit: 100,
  })

  const statsData = useQuery(api.teoria.query.getQuestionsStats, {
    qualificationName,
  })

  const questions = questionsData?.questions || []
  const stats = statsData || { total: 0, years: [] }

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  if (!questionsData || !statsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie pytań...</h1>
            <p className="text-muted-foreground">
              Pobieranie pytań z bazy danych
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <PageHeaderWrapper
      title={"Baza pytań"}
      description={"      Przeglądaj wszystkie dostępne pytania i odpowiedzi"}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Filtry */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtry i wyszukiwanie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                ///notka do naprawy dzieki za notke
                placeholder="Szukaj pytań..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">Rok</label>
                <select
                  value={selectedYear || ""}
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value
                        ? Number.parseInt(e.target.value)
                        : undefined,
                    )
                  }
                  className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 w-full cursor-pointer rounded-md border p-2"
                >
                  <option
                    value=""
                    className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 cursor-pointer"
                  >
                    Wszystkie lata
                  </option>
                  {stats.years
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>
              Znaleziono: <strong>{questions.length}</strong> pytań
            </span>
            <span>•</span>
            <span>
              Łącznie: <strong>{stats.total}</strong> pytań w bazie
            </span>
            {stats.years.length > 0 && (
              <>
                <span>•</span>
                <span>
                  Lata:{" "}
                  <strong>
                    {Math.min(...stats.years)} - {Math.max(...stats.years)}
                  </strong>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer transition-colors"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge variant="outline">#{question.id.slice(-8)}</Badge>
                      {question.year && (
                        <Badge variant="outline">Rok {question.year}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-medium">
                      {question.question}
                    </CardTitle>
                  </div>
                  <div className="ml-4">
                    {expandedQuestion === question.id ? (
                      <ChevronUp className="text-muted-foreground h-5 w-5" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedQuestion === question.id && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {question.imageUrl && (
                      <div>
                        <img
                          src={question.imageUrl || "/placeholder.svg"}
                          alt="Obrazek do pytania"
                          className="h-auto max-w-full rounded-lg border"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="mb-3 font-medium">Odpowiedzi:</h4>
                      <div className="space-y-2">
                        {question.answers.map((answer, index) => (
                          <div
                            key={index}
                            className={`rounded-lg border p-3 ${
                              index === question.correctAnswer
                                ? "border-green-500 text-green-500"
                                : "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {index === question.correctAnswer && (
                                <Badge className="bg-green-500">Poprawna</Badge>
                              )}
                              <span className="font-semibold">
                                {question.answerLabels?.[index] ||
                                  String.fromCharCode(65 + index)}
                                .
                              </span>
                              <span>{answer}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {questions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-gray-500">
                {searchTerm || selectedYear
                  ? "Nie znaleziono pytań spełniających kryteria wyszukiwania."
                  : "Brak pytań dla tej kwalifikacji."}
              </p>
              {(searchTerm || selectedYear) && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedYear(undefined)
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Wyczyść filtry
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button onClick={() => window.history.back()} variant="outline">
            Powrót do trybów gry
          </Button>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
