import type { Doc } from "convex/_generated/dataModel"
import { motion } from "framer-motion"
import { Target, Trophy } from "lucide-react"
import { cn } from "~/lib/utils"

export default function QuizCompletedResultHeader({
  isCurrentUserWinner,
  winnerType,
  winnerPlayerData: winnerPlayerData,
}: {
  isCurrentUserWinner: boolean
  winnerType?: "by_score" | "by_time"
  winnerPlayerData?: Doc<"users">
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-border relative w-full overflow-hidden rounded-lg border p-8 text-center"
      style={{
        background: isCurrentUserWinner
          ? "linear-gradient(135deg, rgb(var(--color-primary) / 0.1), rgb(var(--color-muted)))"
          : "linear-gradient(135deg, rgb(var(--color-accent) / 0.1), rgb(var(--color-muted)))",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
          isCurrentUserWinner ? "bg-primary" : "bg-accent"
        }`}
      >
        {isCurrentUserWinner ? (
          <Trophy className="text-primary-foreground h-10 w-10" />
        ) : (
          <Target className="text-accent-foreground h-10 w-10" />
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          `text-4xl font-bold tracking-tight`,
          isCurrentUserWinner && "text-green-500",
        )}
      >
        {isCurrentUserWinner ? "Victory!" : "Nice Try!"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mt-2 text-lg"
      >
        <>
          {isCurrentUserWinner ? (
            <>Wygrales poprzez </>
          ) : (
            <>{winnerPlayerData?.username} wygral poprzez </>
          )}
          {winnerType === "by_score" && "punkty!"}
          {winnerType === "by_time" && "czas!"}
        </>
      </motion.p>
    </motion.div>
  )
}
