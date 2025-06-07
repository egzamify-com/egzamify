"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
  Loader2,
} from "lucide-react";
import { api } from "~/trpc/react";

interface BrowseQuestionsProps {
  qualificationId: string;
}

export default function BrowseQuestions({
  qualificationId,
}: BrowseQuestionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Pobieranie pytań z tRPC
  const {
    data: questionsData,
    isLoading,
    error,
  } = api.questions.getBrowseQuestions.useQuery({
    qualificationId,
    search: searchTerm || undefined,
    year: selectedYear,
    limit: 100,
  });

  // Pobieranie statystyk
  const { data: statsData } = api.questions.getQuestionsStats.useQuery({
    qualificationId,
  });

  const questions = questionsData?.questions || [];
  const stats = statsData || { total: 0, years: [] };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Łatwy":
        return "bg-green-100 text-green-800";
      case "Średni":
        return "bg-yellow-100 text-yellow-800";
      case "Trudny":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie pytań...</h1>
            <p className="text-gray-500">Pobieranie pytań z bazy danych</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Błąd ładowania
            </h1>
            <p className="mb-4 text-gray-500">{error.message}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Powrót do trybów
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Baza pytań</h1>
        <p className="text-gray-600">
          Przeglądaj wszystkie dostępne pytania i odpowiedzi
        </p>
      </div>

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
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
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
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Wszystkie lata</option>
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

      {/* Statystyki */}
      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-600">
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

      {/* Lista pytań */}
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => toggleQuestion(question.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="outline">#{question.id.slice(-8)}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary">{question.category}</Badge>
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
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
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
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {index === question.correctAnswer && (
                              <Badge className="bg-green-600">Poprawna</Badge>
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

                  {question.explanation && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h4 className="mb-2 flex items-center gap-2 font-medium">
                        <BookOpen className="h-4 w-4" />
                        Wyjaśnienie:
                      </h4>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Brak danych */}
      {questions.length === 0 && !isLoading && (
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
                  setSearchTerm("");
                  setSelectedYear(undefined);
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

      {/* Powrót */}
      <div className="mt-8 text-center">
        <Button onClick={() => window.history.back()} variant="outline">
          Powrót do trybów gry
        </Button>
      </div>
    </div>
  );
}
