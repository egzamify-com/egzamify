"use client";

import { ChevronDown, ChevronUp, Filter, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
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

  const { data: statsData } = api.questions.getQuestionsStats.useQuery({
    qualificationId,
  });

  const questions = questionsData?.questions || [];
  const stats = statsData || { total: 0, years: [] };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  // const getDifficultyColor = (difficulty: string) => {
  //   switch (difficulty) {
  //     case "Łatwy":
  //       return "bg-green-100 text-green-800";
  //     case "Średni":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Trudny":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Ładowanie pytań...</h1>
            <p className="text-gray-500">Pobieranie pytań z bazy danych</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Błąd ładowania
            </h1>
            <p className="text-gray-500 mb-4">{error.message}</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Baza pytań</h1>
        <p className="text-gray-600">
          Przeglądaj wszystkie dostępne pytania i odpowiedzi
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtry i wyszukiwanie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Szukaj pytań..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Rok</label>
              <select
                value={selectedYear || ""}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value
                      ? Number.parseInt(e.target.value)
                      : undefined,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md"
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

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleQuestion(question.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-3">Odpowiedzi:</h4>
                    <div className="space-y-2">
                      {question.answers.map((answer, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
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
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

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

      <div className="mt-8 text-center">
        <Button onClick={() => window.history.back()} variant="outline">
          Powrót do trybów gry
        </Button>
      </div>
    </div>
  );
}
