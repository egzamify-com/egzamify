import type { Id } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"

const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

export async function getUserAnswersFromTimePeriod(
  ctx: QueryCtx,
  userId: Id<"users">,
  timePeriodArg: "sixMonthsAgo" | "weekAgo" | "allTime",
) {
  let timePeriod = 0

  if (timePeriodArg === "weekAgo") timePeriod = weekAgo
  else if (timePeriodArg === "sixMonthsAgo") timePeriod = sixMonthsAgo
  else if (timePeriodArg === "allTime") timePeriod = 0

  const userAnswers = await ctx.db
    .query("userAnswers")
    .withIndex("by_userId", (q) =>
      q.eq("userId", userId).gte("_creationTime", timePeriod),
    )
    .collect()

  return userAnswers
}

export const getHourKey = (timestamp: number): string => {
  const date = new Date(timestamp)
  return `${date.getHours()}:00`
}

export const getDateKey = (
  timestamp: number,
  groupBy: "day" | "week" | "month",
): string => {
  const date = new Date(timestamp)
  if (groupBy === "day") {
    return date.toISOString().split("T")[0] ?? date.toISOString()
  } else if (groupBy === "week") {
    const day = date.getDay()
    return ["Nie", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"][day] || "Pon"
  } else {
    return date.toLocaleDateString("pl-PL", { month: "short" })
  }
}
