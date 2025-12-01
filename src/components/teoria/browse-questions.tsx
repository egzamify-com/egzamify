"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Filter, Loader2, Search } from "lucide-react"
import { useEffect, useState } from "react"
import CompleteQuestion from "~/app/dashboard/online/pvp-quiz/game/[pvpQuizId]/(components)/quiz-game/complete-question-card/complete-question"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import PageHeaderWrapper from "../page-header-wrapper"

type QuestionAnswer = Doc<"answers">

interface BrowseQuestionData {
  question: Doc<"questions">
  answers: QuestionAnswer[]
  correctAnswerIndex: number
}

export default function BrowseQuestions({
  qualificationName,
}: {
  qualificationName: string
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  )
  const [expandedQuestionId, setExpandedQuestionId] =
    useState<Id<"questions"> | null>(null)

  const [page, setPage] = useState(0)
  const itemsPerPage = 10

  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setIsTyping(true)
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setIsTyping(false)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const questionsData = useQuery(api.teoria.query.getBrowseQuestions, {
    qualificationName,
    search: debouncedSearchTerm || undefined,
    year: selectedYear,
    limit: itemsPerPage,
    offset: page * itemsPerPage,
    _refreshKey: 0,
  })

  const statsData = useQuery(api.teoria.query.getQuestionsStats, {
    qualificationName,
  })

  const questions: BrowseQuestionData[] = questionsData?.questions || []
  const totalQuestionsInFilteredSet = questionsData?.total || 0
  const stats = statsData || { total: 0, years: [] }

  const toggleQuestion = (questionId: Id<"questions">) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const isLoading =
    !questionsData || !statsData || (isTyping && questionsData === undefined)

  return (
    <PageHeaderWrapper
      title={"Baza pytań"}
      description={"Przeglądaj wszystkie dostępne pytania i odpowiedzi"}
      icon={<Search />}
    >
      <div className="container mx-auto px-4 py-8">
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
                placeholder="Szukaj pytań..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
                className="pl-10"
              />

              {isTyping && (
                <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">Rok</label>
                <select
                  value={selectedYear || ""}
                  onChange={(e) => {
                    setSelectedYear(
                      e.target.value
                        ? Number.parseInt(e.target.value)
                        : undefined,
                    )
                    setPage(0)
                  }}
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
              Znaleziono: <strong>{totalQuestionsInFilteredSet}</strong> pytań
              {isTyping && (
                <Loader2 className="ml-2 inline-block h-4 w-4 animate-spin" />
              )}
            </span>
            <span>•</span>
            <span>
              Łącznie w bazie: <strong>{stats.total}</strong> pytań
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
          {questions.map((data) => (
            <Card key={data.question._id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer transition-colors"
                onClick={() => toggleQuestion(data.question._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge variant="outline">
                        #{data.question._id.slice(-8)}
                      </Badge>
                      {data.question.year && (
                        <Badge variant="outline">
                          Rok {data.question.year}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-medium">
                      {data.question.content}{" "}
                    </CardTitle>
                  </div>
                  <div className="ml-4">
                    {expandedQuestionId === data.question._id ? (
                      <ChevronUp className="text-muted-foreground h-5 w-5" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedQuestionId === data.question._id && (
                <CardContent className="pt-0">
                  <CompleteQuestion
                    {...{
                      question: data.question,
                      answers: data.answers.map((answer) => ({
                        ...answer,
                        isSelected:
                          data.correctAnswerIndex ===
                          data.answers.findIndex((a) => a._id === answer._id),
                      })),
                      nonInteractive: true,
                      showCorrectAnswer: true,

                      currentUserQuizData: undefined,
                      otherUsersQuizData: [],
                      showExplanationBtn: true,
                      showQuestionMetadata: false,
                    }}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {totalQuestionsInFilteredSet > itemsPerPage && (
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              variant="outline"
            >
              Poprzednia strona
            </Button>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={
                (page + 1) * itemsPerPage >= totalQuestionsInFilteredSet
              }
              variant="outline"
            >
              Następna strona
            </Button>
          </div>
        )}

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
