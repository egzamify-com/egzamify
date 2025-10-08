"use client"

import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useAction, useMutation, useQuery } from "convex/react"
import {
  CheckCircle,
  Clock,
  Flame,
  Lightbulb,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface RandomQuestionGameProps {
  qualificationId: string
}

export default function RandomQuestionGame({
  qualificationId,
}: RandomQuestionGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [answerStreak, setAnswerStreak] = useState(0)
  const [sessionId, setSessionId] = useState<Id<"userActivityHistory"> | null>(
    null,
  )

  const [aiExplanation, setAiExplanation] = useState<string | null>(null)
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [displayedExplanation, setDisplayedExplanation] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const isGeneratingRef = useRef(false)

  const questionData = useQuery(api.teoria.query.getRandomQuestion, {
    qualificationId: qualificationId as Id<"qualifications">,
    _refreshKey: refreshKey,
  })

  const currentQuestion = questionData?.question

  const generateExplanation = useAction(api.teoria.actions.generateExplanation)
  const saveUserAnswer = useMutation(api.statistics.mutations.saveUserAnswer)
  const startStudySession = useMutation(
    api.statistics.mutations.startStudySession,
  )
  const endStudySession = useMutation(api.statistics.mutations.endStudySession)

  // POPRAWIONE: Sesja nauki - start i cleanup
  useEffect(() => {
    let currentSessionId: Id<"userActivityHistory"> | null = null

    // Start sesji
    startStudySession().then((result) => {
      currentSessionId = result.sessionId
      setSessionId(result.sessionId)
      console.log("📚 Sesja nauki rozpoczęta:", result.sessionId)
    })

    // Cleanup - zakończ sesję przy odmontowaniu
    return () => {
      if (currentSessionId) {
        console.log("🛑 Kończenie sesji nauki:", currentSessionId)
        endStudySession({ sessionId: currentSessionId })
      }
    }
  }, []) // Pusty deps array - tylko raz przy montowaniu

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

  const typeWriterEffect = (text: string, speed = 30) => {
    setIsTyping(true)
    setDisplayedExplanation("")

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedExplanation((prev) => prev + text.charAt(index))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, speed)

    return () => clearInterval(timer)
  }

  useEffect(() => {
    const savedStreak = getStreakFromStorage()
    setAnswerStreak(savedStreak)
  }, [])

  useEffect(() => {
    if (currentQuestion && !isGeneratingRef.current) {
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(null)
      setTimeLeft(120)
      setDisplayedExplanation("")
      setIsTyping(false)
      setShowExplanation(false)
      setIsLoadingExplanation(false)

      if (currentQuestion.explanation) {
        setAiExplanation(currentQuestion.explanation)
      } else {
        setAiExplanation(null)
      }
    }
  }, [currentQuestion])

  useEffect(() => {
    if (timeLeft > 0 && !showResult && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && currentQuestion) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, currentQuestion])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    await saveUserAnswer({
      question_id: currentQuestion.id as Id<"questions">,
      answer_index: answerIndex,
      isCorrect: correct,
    })

    updateStreak(correct)
  }

  const handleTimeUp = () => {
    setIsCorrect(false)
    setShowResult(true)
    updateStreak(false)
  }

  const handleNewQuestion = () => {
    if (!isGeneratingRef.current) {
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleShowExplanation = () => {
    if (!currentQuestion) return
    setShowExplanation(true)
    if (aiExplanation) {
      typeWriterEffect(aiExplanation, 15)
    }
  }

  const handleGenerateExplanation = async () => {
    if (!currentQuestion || isLoadingExplanation) return

    isGeneratingRef.current = true
    setIsLoadingExplanation(true)
    setShowExplanation(true)
    setDisplayedExplanation("")

    try {
      const result = await generateExplanation({
        questionId: currentQuestion.id,
        questionContent: currentQuestion.question,
        answers: currentQuestion.answers,
        correctAnswerIndex: currentQuestion.correctAnswer,
        answerLabels: currentQuestion.answerLabels,
      })

      setAiExplanation(result.explanation)
      typeWriterEffect(result.explanation, 25)
    } catch (error) {
      console.error("❌ Błąd podczas generowania wyjaśnienia:", error)
      const errorMessage =
        "Przepraszamy, wystąpił błąd podczas generowania wyjaśnienia."
      setAiExplanation(errorMessage)
      typeWriterEffect(errorMessage, 25)
    } finally {
      setIsLoadingExplanation(false)
      isGeneratingRef.current = false
    }
  }

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
    )
  }

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
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex">
            <h1 className="text-2xl font-bold">Losowe pytanie</h1>
            <Badge variant="secondary">
              Pytanie #{currentQuestion.id.slice(-8)}
              {currentQuestion.year && ` • Rok ${currentQuestion.year}`}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-700">{answerStreak}</span>
              <span className="text-sm text-orange-600">seria odpowiedzi</span>
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
                "w-full p-4 text-left border rounded-lg transition-colors "

              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800"
                } else if (
                  index === selectedAnswer &&
                  selectedAnswer !== currentQuestion.correctAnswer
                ) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800"
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600"
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "border-blue-500 bg-blue-50"
                } else {
                  buttonClass +=
                    "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 text-center">
              {isCorrect ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-8 w-8" />
                    <span className="text-2xl font-bold">
                      Poprawna odpowiedź!
                    </span>
                  </div>
                  {answerStreak > 1 && (
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                      <Flame className="h-6 w-6" />
                      <span className="text-lg font-semibold">
                        Seria {answerStreak} poprawnych odpowiedzi!
                      </span>
                      <Flame className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <XCircle className="h-8 w-8" />
                    <span className="text-2xl font-bold">
                      {timeLeft === 0 ? "Czas minął!" : "Niepoprawna odpowiedź"}
                    </span>
                  </div>
                  {answerStreak > 0 && (
                    <div className="text-muted-foreground">
                      <span className="text-sm">
                        Seria odpowiedzi została przerwana na {answerStreak}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {showExplanation && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all duration-300">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-blue-800">
                  <Lightbulb className="h-5 w-5" />
                  Wyjaśnienie AI:
                  {isLoadingExplanation && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </h3>

                {isLoadingExplanation && !displayedExplanation && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      Groq generuje wyjaśnienie...
                    </span>
                  </div>
                )}

                {displayedExplanation && (
                  <div className="leading-relaxed text-black">
                    <p className="whitespace-pre-wrap">
                      {displayedExplanation}
                      {isTyping && (
                        <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-blue-500"></span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button onClick={() => window.history.back()} variant="outline">
          Powrót do trybów
        </Button>

        <div className="flex gap-2">
          {showResult && (
            <>
              {!showExplanation && (
                <Button
                  onClick={
                    aiExplanation
                      ? handleShowExplanation
                      : handleGenerateExplanation
                  }
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  disabled={isLoadingExplanation}
                >
                  <Lightbulb className="h-4 w-4" />
                  {aiExplanation ? "Pokaż wyjaśnienie" : "Objaśnij z AI (Groq)"}
                </Button>
              )}

              <Button
                onClick={handleNewQuestion}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoadingExplanation}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Nowe pytanie
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
