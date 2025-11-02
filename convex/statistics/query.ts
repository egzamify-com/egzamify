import { getAuthUserId } from "@convex-dev/auth/server"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import { getDateKey, getHourKey, getUserAnswersFromTimePeriod } from "./helpers"

export const getUserStatistics = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswers = await getUserAnswersFromTimePeriod(
      ctx,
      userId,
      "allTime",
    )

    const activityHistory = await ctx.db
      .query("userActivityHistory")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect()

    const explanations = await ctx.db
      .query("explanations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    const totalQuestions = userAnswers.length
    const correctAnswers = userAnswers.filter((a) => a.isCorrect).length
    const averageAccuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

    const totalStudyTime = activityHistory.reduce((sum, activity) => {
      const duration = (activity.stop_date - activity.start_date) / 1000 / 60
      return sum + duration
    }, 0)

    return {
      totalQuestions,
      correctAnswers,
      averageAccuracy: Math.round(averageAccuracy * 10) / 10,
      totalStudyTime: Math.round(totalStudyTime),
      aiExplanationsUsed: explanations.length,
    }
  },
})

export const getWeeklyProgress = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswers = await getUserAnswersFromTimePeriod(
      ctx,
      userId,
      "weekAgo",
    )

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const activityHistory = await ctx.db
      .query("userActivityHistory")
      .withIndex("by_user_date", (q) =>
        q.eq("user_id", userId).gte("start_date", weekAgo),
      )
      .collect()

    const weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"]
    const weeklyData = weekDays.map((day) => ({
      day,
      questions: 0,
      correct: 0,
      time: 0,
    }))

    userAnswers.forEach((answer) => {
      const dayKey = getDateKey(answer._creationTime, "week")
      const dayIndex = weekDays.indexOf(dayKey)
      if (dayIndex !== -1 && weeklyData[dayIndex]) {
        weeklyData[dayIndex].questions++
        if (answer.isCorrect) {
          weeklyData[dayIndex].correct++
        }
      }
    })

    activityHistory.forEach((activity) => {
      const dayKey = getDateKey(activity.start_date, "week")
      const dayIndex = weekDays.indexOf(dayKey)
      if (dayIndex !== -1 && weeklyData[dayIndex]) {
        const duration = (activity.stop_date - activity.start_date) / 1000 / 60
        weeklyData[dayIndex].time += Math.round(duration)
      }
    })

    return weeklyData
  },
})

export const getQualificationStats = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswers = await getUserAnswersFromTimePeriod(
      ctx,
      userId,
      "allTime",
    )

    const questionIds = [...new Set(userAnswers.map((a) => a.questionId))]
    const questions = await Promise.all(questionIds.map((id) => ctx.db.get(id)))

    const qualificationMap = new Map<
      string,
      {
        qualificationId: string
        name: string
        completed: number
        correct: number
      }
    >()

    for (let i = 0; i < userAnswers.length; i++) {
      const answer = userAnswers[i]
      if (!answer) continue

      const question = questions.find((q) => q?._id === answer.questionId)
      if (!question) continue

      const qualificationId = question.qualificationId
      const qualification = await ctx.db.get(qualificationId)
      if (!qualification) continue

      if (!qualificationMap.has(qualificationId)) {
        qualificationMap.set(qualificationId, {
          qualificationId,
          name: qualification.name,
          completed: 0,
          correct: 0,
        })
      }

      const stats = qualificationMap.get(qualificationId)!
      stats.completed++
      if (answer.isCorrect) {
        stats.correct++
      }
    }

    const result = Array.from(qualificationMap.values()).map((stat) => ({
      name: stat.name,
      completed: stat.completed,
      correct: stat.correct,
      accuracy:
        stat.completed > 0
          ? Math.round((stat.correct / stat.completed) * 100 * 10) / 10
          : 0,
    }))

    return result
  },
})

export const getMonthlyTrends = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswers = await getUserAnswersFromTimePeriod(
      ctx,
      userId,
      "sixMonthsAgo",
    )

    const monthlyMap = new Map<
      string,
      {
        questions: number
        correct: number
      }
    >()

    userAnswers.forEach((answer) => {
      const monthKey = getDateKey(answer._creationTime, "month")
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { questions: 0, correct: 0 })
      }
      const stats = monthlyMap.get(monthKey)!
      stats.questions++
      if (answer.isCorrect) stats.correct++
    })

    const result = Array.from(monthlyMap.entries()).map(([month, stats]) => ({
      month,
      questions: stats.questions,
      accuracy:
        stats.questions > 0
          ? Math.round((stats.correct / stats.questions) * 100 * 10) / 10
          : 0,
    }))

    return result.slice(-6)
  },
})

export const getStudyPatterns = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const activityHistory = await ctx.db
      .query("userActivityHistory")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect()

    const hourlyMap = new Map<string, number>()

    activityHistory.forEach((activity) => {
      const hourKey = getHourKey(activity.start_date)
      hourlyMap.set(hourKey, (hourlyMap.get(hourKey) ?? 0) + 1)
    })

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    const result = hours.map((hour) => ({
      time: hour,
      sessions: hourlyMap.get(hour) ?? 0,
    }))

    return result
  },
})

export const getSkillRadar = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const userAnswers = await getUserAnswersFromTimePeriod(
      ctx,
      userId,
      "allTime",
    )

    const questionIds = [...new Set(userAnswers.map((a) => a.questionId))]
    const questions = await Promise.all(questionIds.map((id) => ctx.db.get(id)))

    const categoryMap = new Map<
      string,
      {
        total: number
        correct: number
      }
    >()

    for (let i = 0; i < userAnswers.length; i++) {
      const answer = userAnswers[i]
      if (!answer) continue

      const question = questions.find((q) => q?._id === answer.questionId)
      if (!question?.category) continue

      if (!categoryMap.has(question.category)) {
        categoryMap.set(question.category, { total: 0, correct: 0 })
      }

      const stats = categoryMap.get(question.category)!
      stats.total++
      if (answer.isCorrect) stats.correct++
    }

    const result = Array.from(categoryMap.entries()).map(([skill, stats]) => ({
      skill,
      current:
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      target: 90,
    }))

    return result
  },
})

export const getDifficultyBreakdown = query({
  handler: async () => {
    return [
      { name: "Łatwe", value: 45, color: "#00C49F" },
      { name: "Średnie", value: 35, color: "#FFBB28" },
      { name: "Trudne", value: 20, color: "#FF8042" },
    ]
  },
})
