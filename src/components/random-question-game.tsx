"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

interface RandomQuestionGameProps {
  qualificationId: string;
}

export default function RandomQuestionGame({
  qualificationId,
}: RandomQuestionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minuty
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateRandomQuestion = (): Question | null => {
    return null;
  };

  // Inicjalizacja pytania
  useEffect(() => {
    const question = generateRandomQuestion();
    setCurrentQuestion(question);
  }, []);

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
    const question = generateRandomQuestion();
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(120);
  };

  if (!currentQuestion) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Losowe pytanie</h1>
            <p className="text-lg text-gray-500">Brak pytań w bazie danych.</p>
            <p className="mt-2 text-sm text-gray-400">
              Połącz z bazą danych aby załadować pytania.
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
            <Badge variant="secondary">Pytanie #{currentQuestion.id}</Badge>
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

            {currentQuestion.explanation && (
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-semibold">Wyjaśnienie:</h4>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
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
            <Button
              onClick={handleNewQuestion}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Nowe pytanie
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
