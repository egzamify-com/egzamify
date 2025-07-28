"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Clock, Flag, Loader2, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

interface FullTestGameProps {
  qualificationId: string;
}

export default function FullTestGame({ qualificationId }: FullTestGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minut w sekundach
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Pobieranie pytań z Convex
  const questionsData = useQuery(api.teoria.query.getQuestionsByQualification, {
    qualificationId: qualificationId as Id<"qualifications">,
  });

  const questions = questionsData?.questions || [];

  // Inicjalizacja tablicy odpowiedzi gdy pytania się załadują
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(null));
    }
  }, [questions.length]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isFinished && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleFinishTest();
    }
  }, [timeLeft, isFinished, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = () => {
    setIsFinished(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const answeredQuestions = selectedAnswers.filter(
    (answer) => answer !== null,
  ).length;
  const progress =
    questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0;

  // Loading state
  if (!questionsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie testu...</h1>
            <p className="text-gray-500">Pobieranie pytań z bazy danych</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Brak pytań
  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Test - 0 pytań</h1>
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

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Wyniki testu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-gray-600">{percentage}%</div>
              <Badge
                variant={percentage >= 70 ? "default" : "destructive"}
                className="mt-2"
              >
                {percentage >= 70 ? "Zaliczony" : "Niezaliczony"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Poprawne odpowiedzi:</span>
                <span className="font-semibold text-green-600">{score}</span>
              </div>
              <div className="flex justify-between">
                <span>Błędne odpowiedzi:</span>
                <span className="font-semibold text-red-600">
                  {questions.length - score}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Czas:</span>
                <span className="font-semibold">
                  {formatTime(60 * 60 - timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1"
              >
                Powrót do trybów
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Spróbuj ponownie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header z timerem i postępem */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Test - {questions.length} pytań
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeLeft < 300 ? "text-red-600" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Postęp: {answeredQuestions}/{questions.length} odpowiedzi
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Pytanie */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Pytanie {currentQuestion + 1}
            {questions[currentQuestion]?.year && (
              <Badge variant="outline" className="ml-2">
                Rok {questions[currentQuestion].year}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg">{questions[currentQuestion]?.question}</p>

          {questions[currentQuestion]?.imageUrl && (
            <div className="mb-6">
              <img
                src={questions[currentQuestion].imageUrl || "/placeholder.svg"}
                alt="Obrazek do pytania"
                className="h-auto max-w-full rounded-lg border"
              />
            </div>
          )}

          <div className="space-y-3">
            {questions[currentQuestion]?.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="mr-2 font-semibold">
                    {questions[currentQuestion]?.answerLabels?.[index] ||
                      String.fromCharCode(65 + index)}
                    .
                  </span>
                  <span>{answer}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nawigacja */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Poprzednie
        </Button>

        <div className="flex gap-2">
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleFinishTest}
              className="bg-green-600 hover:bg-green-700"
            >
              <Flag className="mr-2 h-4 w-4" />
              Zakończ test
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Następne
              <SkipForward className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mapa pytań */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Mapa pytań</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`h-8 w-8 rounded border text-xs ${
                  index === currentQuestion
                    ? "border-blue-500 bg-blue-500 text-white"
                    : selectedAnswers[index] !== null
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
