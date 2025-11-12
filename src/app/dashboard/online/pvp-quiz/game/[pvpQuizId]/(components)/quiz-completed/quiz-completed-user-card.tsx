"use client"

import type { Doc } from "convex/_generated/dataModel"
import { motion } from "framer-motion"
import { AppleIcon, Clock, GamepadIcon, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { formatDuration } from "~/lib/dateUtils"
import { cn } from "~/lib/utils"

export function QuizCompletedPlayerStatsCard({
  quizData,
  playerType,
  cardIndex,
  user,
  isCurrentUser,
}: {
  quizData: Doc<"pvpQuizzes">
  playerType: "creator" | "opponent"
  cardIndex: number
  user: Doc<"users">
  isCurrentUser: boolean
}) {
  const playerData =
    playerType === "creator" ? quizData.creatorData : quizData.opponentData
  if (!playerData) return null

  const accuracy = Math.round(
    (playerData.score! / quizData.quizQuestionsIds.length) * 100,
  )
  const isWinner = quizData.winnerUserId === user._id

  return (
    <motion.div
      initial={{ opacity: 0, x: cardIndex === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + cardIndex * 0.1, duration: 0.4 }}
      className="w-full"
    >
      <Card
        className={cn(
          `relative w-full overflow-hidden`,
          isCurrentUser ? "border-primary" : "border-border",
        )}
      >
        <CardHeader>
          <CardTitle>
            {isWinner && (
              <div className="absolute top-4 right-4">
                <Trophy className="h-5 w-5 text-yellow-300" />
              </div>
            )}

            <div className="flex items-center gap-1">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full`}
              >
                <ActivityStatusAvatar userToShow={user} />
              </div>
              <div>
                <h3 className="text-foreground text-lg font-semibold">
                  {user.username}
                </h3>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <AppleIcon className="h-4 w-4" />
                Score
              </span>
              <span className="text-foreground text-2xl font-bold">
                {playerData.score ?? 0}/{quizData.quizQuestionsIds.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <GamepadIcon className="h-4 w-4" /> Accuracy
              </span>
              <span className={`text-lg font-semibold`}>{accuracy}%</span>
            </div>

            {playerData.time && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Time
                </span>
                <span className="text-foreground text-lg font-semibold">
                  {formatDuration(playerData.time)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
