"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Search, ChevronDown, ChevronUp, BookOpen, Filter } from "lucide-react";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: string;
}

interface BrowseQuestionsProps {
  qualificationId: string;
}

export default function BrowseQuestions({
  qualificationId,
}: BrowseQuestionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Puste dane - gotowe na integrację z API
  const questions: Question[] = [];

  const categories = ["all"];
  const difficulties = ["all"];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      question.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const toggleQuestion = (questionId: number) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Baza pytań</h1>
        <p className="text-gray-600">
          Przeglądaj wszystkie dostępne pytania i odpowiedzi
        </p>
      </div>

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
              <label className="mb-2 block text-sm font-medium">
                Kategoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Wszystkie kategorie" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                Poziom trudności
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "Wszystkie poziomy" : difficulty}
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
            Znaleziono: <strong>{filteredQuestions.length}</strong> pytań
          </span>
          <span>•</span>
          <span>
            Łącznie: <strong>{questions.length}</strong> pytań w bazie
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => toggleQuestion(question.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="outline">#{question.id}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary">{question.category}</Badge>
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

      {questions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-gray-500">Brak pytań w bazie danych.</p>
            <p className="mt-2 text-sm text-gray-400">
              Połącz z bazą danych aby załadować pytania.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredQuestions.length === 0 && questions.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-gray-500">
              Nie znaleziono pytań spełniających kryteria wyszukiwania.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
              variant="outline"
              className="mt-4"
            >
              Wyczyść filtry
            </Button>
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
