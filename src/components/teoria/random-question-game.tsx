"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Clock, Flame, Loader2, RotateCcw, Shuffle } from "lucide-react"
import { useEffect, useState } from "react"
import CompleteQuestion from "~/app/dashboard/online/pvp-quiz/game/[pvpQuizId]/(components)/quiz-game/complete-question-card/complete-question"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import PageHeaderWrapper from "../page-header-wrapper"

type QuizAnswersType = Doc<"answers">

interface AnswerWithSelection extends QuizAnswersType {
  isSelected: boolean
}

export default function RandomQuestionGame({
  qualificationName,
}: {
  qualificationName: string
}) {
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [refreshKey, setRefreshKey] = useState(0)
  const [answerStreak, setAnswerStreak] = useState(0)
  const [sessionId, setSessionId] = useState<Id<"userActivityHistory"> | null>(
    null,
  )

  const [submittedAnswerId, setSubmittedAnswerId] =
    useState<Id<"userAnswers"> | null>(null)

  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

  const questionData = useQuery(api.teoria.query.getRandomQuestion, {
    qualificationName,
    _refreshKey: refreshKey,
  })

  const user = useQuery(api.users.query.getCurrentUser)

  const currentQuestion: Doc<"questions"> | null | undefined =
    questionData?.randomQuestion
  const currentQuestionConvexAnswers: Doc<"answers">[] | undefined =
    questionData?.answers

  const [answers, setAnswers] = useState<AnswerWithSelection[] | undefined>(
    undefined,
  )

  const saveUserAnswer = useMutation(api.statistics.mutations.saveUserAnswer)
  const startStudySession = useMutation(
    api.statistics.mutations.startStudySession,
  )
  const endStudySession = useMutation(api.statistics.mutations.endStudySession)

  useEffect(() => {
    let currentSessionId: Id<"userActivityHistory"> | null = null

    startStudySession().then((result) => {
      currentSessionId = result.sessionId
      setSessionId(result.sessionId)
    })

    return () => {
      if (currentSessionId) {
        endStudySession({ sessionId: currentSessionId })
      }
    }
  }, [])

  useEffect(() => {
    if (currentQuestionConvexAnswers) {
      setAnswers(
        currentQuestionConvexAnswers.map((answer) => ({
          ...answer,
          isSelected: false,
        })),
      )
      setShowResult(false)
      setSubmittedAnswerId(null)
      setTimeLeft(120)
      setIsSubmittingAnswer(false)
    }
  }, [currentQuestionConvexAnswers])

  const getStreakFromStorage = (): number => {
    if (typeof window === "undefined") return 0
    const stored = localStorage.getItem("answerStreak")
    return stored ? Number.parseInt(stored, 10) : 0
  }

  const saveStreakToStorage = (streak: number): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("answerStreak", streak.toString())
  }

  const updateStreak = (correct: boolean): void => {
    if (correct) {
      const newStreak = answerStreak + 1
      setAnswerStreak(newStreak)
      saveStreakToStorage(newStreak)
    } else {
      setAnswerStreak(0)
      saveStreakToStorage(0)
    }
  }

  useEffect(() => {
    const savedStreak = getStreakFromStorage()
    setAnswerStreak(savedStreak)
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !showResult && currentQuestion && !isSubmittingAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && currentQuestion) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, currentQuestion, isSubmittingAnswer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = async (
    selectedAnswerWithSelection: AnswerWithSelection,
  ) => {
    if (showResult || !currentQuestion || !answers || isSubmittingAnswer) return

    setIsSubmittingAnswer(true)

    setAnswers((prevAnswers) => {
      return prevAnswers?.map((ans) => {
        if (ans._id === selectedAnswerWithSelection._id) {
          return { ...ans, isSelected: true }
        }
        return { ...ans, isSelected: false }
      })
    })

    const wasUserCorrect = selectedAnswerWithSelection.isCorrect
    const { isSelected, ...answerForConvex } = selectedAnswerWithSelection

    try {
      const userAnswerId = await saveUserAnswer({
        answer: answerForConvex,
        wasUserCorrect: wasUserCorrect,
      })
      setSubmittedAnswerId(userAnswerId)

      updateStreak(wasUserCorrect)
      setShowResult(true)
    } catch (error) {
      console.error("Błąd podczas zapisywania odpowiedzi:", error)
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const handleTimeUp = () => {
    if (isSubmittingAnswer) return
    setShowResult(true)
    updateStreak(false)
  }

  const handleNewQuestion = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (
    questionData === undefined ||
    user === undefined ||
    answers === undefined
  ) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <h1 className="mb-4 text-2xl font-bold">Ładowanie pytania...</h1>
            <p className="text-muted-foreground">
              Losowanie pytania z bazy danych
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Losowe pytanie</h1>
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

  return (
    <PageHeaderWrapper
      title={"1 losowe pytanie"}
      description={"Szybki test z jednym losowym pytaniem."}
      icon={<Shuffle />}
    >
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Losowe pytanie</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-orange-600 bg-orange-200 px-3 py-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-orange-700">
                  {answerStreak}
                </span>
                <span className="text-sm font-bold text-orange-600">seria</span>
              </div>

              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5" />
                <span className={timeLeft < 30 ? "text-red-600" : ""}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {currentQuestion && answers && (
          <CompleteQuestion
            {...{
              question: currentQuestion,
              answers: answers,

              nonInteractive: showResult || isSubmittingAnswer,
              showCorrectAnswer: showResult,
              handleSelectingNewAnswer: handleAnswerSelect,
              currentUserQuizData:
                showResult && submittedAnswerId && user
                  ? {
                      userProfile: user,
                      userAnswersIds: [submittedAnswerId],
                    }
                  : undefined,
              otherUsersQuizData: [],
              showExplanationBtn: showResult,
              showQuestionMetadata: true,
            }}
          />
        )}

        {isSubmittingAnswer && (
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            disabled={isSubmittingAnswer}
          >
            Powrót do trybów
          </Button>

          {showResult && (
            <Button
              onClick={handleNewQuestion}
              variant="default"
              disabled={isSubmittingAnswer}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Nowe pytanie
            </Button>
          )}
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
