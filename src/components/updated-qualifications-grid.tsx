"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle,
  Clock,
  Lightbulb,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface RandomQuestionGameProps {
  qualificationId: string;
}

export default function RandomQuestionGame({
  qualificationId,
}: RandomQuestionGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minuty
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dodajemy lokalny stan dla wyjaśnienia AI
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // Pobieranie losowego pytania z Convex
  const questionData = useQuery(api.teoria.query.getRandomQuestion, {
    qualificationId: qualificationId as Id<"qualifications">,
  });

  const currentQuestion = questionData?.question;

  // Mutacje Convex
  const saveExplanation = useMutation(api.teoria.mutate.saveExplanation);

  // Ustawienie wyjaśnienia z bazy danych, jeśli istnieje
  useEffect(() => {
    if (currentQuestion?.explanation) {
      setAiExplanation(currentQuestion.explanation);
    } else {
      setAiExplanation(null);
    }
  }, [currentQuestion]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResult && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && currentQuestion) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, currentQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleTimeUp = () => {
    setIsCorrect(false);
    setShowResult(true);
  };

  const handleNewQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(120);
    setAiExplanation(null);
    setRefreshKey((prev) => prev + 1); // Force refresh
  };

  // Funkcja do generowania wyjaśnienia (placeholder - będzie potrzebna integracja z AI)
  const handleGenerateExplanation = async () => {
    if (!currentQuestion) return;

    setIsLoadingExplanation(true);

    // Tu będzie integracja z AI (Groq)
    // Na razie placeholder
    const mockExplanation = `Wyjaśnienie AI dla pytania: ${currentQuestion.question.slice(0, 50)}...`;

    setAiExplanation(mockExplanation);
    setIsLoadingExplanation(false);

    // Zapisz wyjaśnienie do bazy w tle
    try {
      await saveExplanation({
        questionId: currentQuestion.id,
        explanation: mockExplanation,
      });
    } catch (error) {
      console.error("Błąd podczas zapisywania wyjaśnienia:", error);
    }
  };

  // Loading state
  if (questionData === undefined) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie pytania...</h1>
            <p className="text-gray-500">Losowanie pytania z bazy danych</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Brak pytania
  if (!currentQuestion) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Losowe pytanie</h1>
            <p className="text-lg text-gray-500">
              Brak pytań dla tej kwalifikacji.
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="mt-6"
            >
              Powrót do trybów
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Losowe pytanie</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeLeft < 30 ? "text-red-600" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="secondary">
              Pytanie #{currentQuestion.id.slice(-8)}
              {currentQuestion.year && ` • Rok ${currentQuestion.year}`}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pytanie */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Pytanie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg">{currentQuestion.question}</p>

          {currentQuestion.imageUrl && (
            <div className="mb-6">
              <img
                src={currentQuestion.imageUrl || "/placeholder.svg"}
                alt="Obrazek do pytania"
                className="h-auto max-w-full rounded-lg border"
              />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              let buttonClass =
                "w-full p-4 text-left border rounded-lg transition-colors ";

              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (
                  index === selectedAnswer &&
                  selectedAnswer !== currentQuestion.correctAnswer
                ) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "border-blue-500 bg-blue-50";
                } else {
                  buttonClass +=
                    "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center">
                      {showResult &&
                        index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      {showResult &&
                        index === selectedAnswer &&
                        selectedAnswer !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      {!showResult && (
                        <div
                          className={`h-4 w-4 rounded-full border-2 ${
                            selectedAnswer === index
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedAnswer === index && (
                            <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="mr-2 font-semibold">
                      {currentQuestion.answerLabels?.[index] ||
                        String.fromCharCode(65 + index)}
                      .
                    </span>
                    <span>{answer}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Wynik */}
      {showResult && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 text-center">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-2xl font-bold">
                    Poprawna odpowiedź!
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="h-8 w-8" />
                  <span className="text-2xl font-bold">
                    {timeLeft === 0 ? "Czas minął!" : "Niepoprawna odpowiedź"}
                  </span>
                </div>
              )}
            </div>

            {/* Wyjaśnienie */}
            {aiExplanation && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
                  <Lightbulb className="h-5 w-5" />
                  Wyjaśnienie:
                </h3>
                <p className="text-gray-700">{aiExplanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Akcje */}
      <div className="flex items-center justify-between">
        <Button onClick={() => window.history.back()} variant="outline">
          Powrót do trybów
        </Button>

        <div className="flex gap-2">
          {showResult && (
            <>
              {!aiExplanation && (
                <Button
                  onClick={handleGenerateExplanation}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  disabled={isLoadingExplanation}
                >
                  {isLoadingExplanation ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4" />
                      Objaśnij z AI
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleNewQuestion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Nowe pytanie
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
