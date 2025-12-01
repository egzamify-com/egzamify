"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { BookOpen, Clock, Flag, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import CompleteQuestion from "~/app/dashboard/online/pvp-quiz/game/[pvpQuizId]/(components)/quiz-game/complete-question-card/complete-question"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import PageHeaderWrapper from "../page-header-wrapper"

// caly doc
type FullAnswerDoc = Doc<"answers">

interface TestQuestionData {
  question: Doc<"questions">
  answers: FullAnswerDoc[]
  correctAnswerIndex: number
}

export default function FullTestGame({
  qualificationName,
}: {
  qualificationName: string
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswersIndices, setSelectedAnswersIndices] = useState<
    (number | null)[]
  >([])
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [isTestFinished, setIsTestFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [sessionId, setSessionId] = useState<Id<"userActivityHistory"> | null>(
    null,
  )

  const testData = useQuery(api.teoria.query.getTestQuestions, {
    qualificationName,
    numberOfQuestions: 40,
    _refreshKey: refreshKey,
  })

  const user = useQuery(api.users.query.getCurrentUser)
  const startStudySession = useMutation(
    api.statistics.mutations.startStudySession,
  )
  const endStudySession = useMutation(api.statistics.mutations.endStudySession)

  const questions: TestQuestionData[] = testData?.questions || []

  useEffect(() => {
    let currentSessionId: Id<"userActivityHistory"> | null = null

    startStudySession().then((result) => {
      currentSessionId = result.sessionId
      setSessionId(result.sessionId)
    })

    return () => {
      if (currentSessionId && !isTestFinished) {
        endStudySession({ sessionId: currentSessionId })
      }
    }
  }, [isTestFinished])

  useEffect(() => {
    if (questions.length > 0 && selectedAnswersIndices.length === 0) {
      setSelectedAnswersIndices(new Array(questions.length).fill(null))
    }
  }, [questions.length])

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0)
    }
  }, [questions.length, currentQuestionIndex])

  useEffect(() => {
    if (timeLeft > 0 && !isTestFinished && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0 && !isTestFinished) {
      handleFinishTest()
    }
  }, [timeLeft, isTestFinished, questions.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = async (selectedAnswer: FullAnswerDoc) => {
    if (isTestFinished) return

    const currentQuestionData = questions[currentQuestionIndex]
    if (!currentQuestionData) return

    const selectedIndex = currentQuestionData.answers.findIndex(
      (ans) => ans._id === selectedAnswer._id,
    )

    if (selectedIndex === -1) return

    const newAnswers = [...selectedAnswersIndices]
    newAnswers[currentQuestionIndex] = selectedIndex
    setSelectedAnswersIndices(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinishTest = () => {
    setIsTestFinished(true)
    setShowResults(true)
    if (sessionId) {
      endStudySession({ sessionId })
    }
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswersIndices.forEach((answerIndex, index) => {
      if (
        answerIndex !== null &&
        answerIndex === questions[index]?.correctAnswerIndex
      ) {
        correct++
      }
    })
    return correct
  }

  const answeredQuestionsCount = selectedAnswersIndices.filter(
    (answer) => answer !== null,
  ).length
  const progress =
    questions.length > 0 ? (answeredQuestionsCount / questions.length) * 100 : 0

  if (!testData || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie testu...</h1>
            <p className="text-muted-foreground">
              Pobieranie pytań z bazy danych
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Test - 0 pytań</h1>
            <p className="text-muted-foreground text-lg">
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
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

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
              <div className="text-muted-foreground text-xl">{percentage}%</div>
              <Badge
                variant={percentage >= 50 ? "default" : "destructive"}
                className="mt-2"
              >
                {percentage >= 50 ? "Zaliczony" : "Niezaliczony"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Poprawne odpowiedzi:</span>
                <span className="font-semibold text-green-500">{score}</span>
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
                onClick={() => {
                  setRefreshKey((prev) => prev + 1)
                  setCurrentQuestionIndex(0)
                  setSelectedAnswersIndices(
                    new Array(questions.length).fill(null),
                  )
                  setTimeLeft(60 * 60)
                  setIsTestFinished(false)
                  setShowResults(false)
                }}
                className="flex-1 bg-white"
              >
                Spróbuj ponownie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestionIndex]
  if (!currentQuestionData) return null

  const questionForCompleteQuestion = currentQuestionData.question
  const answersFromQuery = currentQuestionData.answers
  const selectedAnswerForCurrentQuestionIndex =
    selectedAnswersIndices[currentQuestionIndex]

  const answersForCompleteQuestion = answersFromQuery.map((answer, index) => ({
    ...answer,
    isSelected: index === selectedAnswerForCurrentQuestionIndex,
  }))

  return (
    <PageHeaderWrapper
      title={"40 pytań z teorii"}
      description={"Pełny test teoretyczny składający się z 40 pytań"}
      icon={<BookOpen />}
    >
      <div className="container mx-auto px-4 py-8">
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
                {currentQuestionIndex + 1} / {questions.length}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>
                Postęp: {answeredQuestionsCount}/{questions.length} odpowiedzi
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {questionForCompleteQuestion && answersForCompleteQuestion && (
          <CompleteQuestion
            {...{
              question: questionForCompleteQuestion,
              answers: answersForCompleteQuestion,
              nonInteractive: isTestFinished,
              showCorrectAnswer: showResults,
              handleSelectingNewAnswer: handleAnswerSelect,
              currentUserQuizData: undefined,
              otherUsersQuizData: [],
              showExplanationBtn: showResults,
              showQuestionMetadata: true,
            }}
          />
        )}

        <div className="flex items-center justify-between py-8">
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0 || isTestFinished}
            variant="outline"
          >
            Poprzednie
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleFinishTest}
                className=""
                variant={"outline"}
                disabled={isTestFinished}
              >
                <Flag className="mr-2 h-4 w-4" />
                Zakończ test
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                variant={"outline"}
                disabled={isTestFinished}
              >
                Następne
                <Clock className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Card className="container mx-auto max-w-4xl py-8">
          <CardHeader>
            <CardTitle className="text-sm">Mapa pytań</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    !isTestFinished && setCurrentQuestionIndex(index)
                  }
                  className={`h-8 w-8 cursor-pointer rounded border text-xs transition-colors ${
                    index === currentQuestionIndex
                      ? "border-blue-500 bg-blue-500 text-white"
                      : selectedAnswersIndices[index] !== null
                        ? "border-muted-foreground text-muted-foreground"
                        : "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 border-gray-300"
                  } ${isTestFinished ? "cursor-not-allowed opacity-70" : ""}`}
                  disabled={isTestFinished}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageHeaderWrapper>
  )
}
