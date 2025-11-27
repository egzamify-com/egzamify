import { v } from "convex/values"
import { query } from "../_generated/server"
import { getQualificationIdFromNameOrThrow } from "./helpers"

export const getTheoryUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users_theory").collect()
    return { users }
  },
})

export const getTheoryUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users_theory")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
    return user
  },
})

export const getQualificationsListPractical = query({
  handler: async (ctx) => {
    const qualifications = await ctx.db.query("qualifications").collect()

    const qualificationsWithQuestions = await Promise.all(
      qualifications.map(async (qualification) => {
        const questions = await ctx.db
          .query("questions")
          .withIndex("by_qualification", (q) =>
            q.eq("qualificationId", qualification._id),
          )
          .collect()

        const baseExams = await ctx.db
          .query("basePracticalExams")
          .withIndex("qualificationId", (q) =>
            q.eq("qualificationId", qualification._id),
          )
          .collect()

        return {
          id: qualification._id,
          name: qualification.name,
          label: qualification.label,
          created_at: qualification.created_at ?? Date.now(),
          questionsCount: questions.length,
          baseExams,
        }
      }),
    )

    return {
      qualifications: qualificationsWithQuestions,
    }
  },
})

export const getQualificationsList = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { search } = args

    let qualifications = await ctx.db.query("qualifications").collect()

    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase()
      qualifications = qualifications.filter((q) =>
        q.name.toLowerCase().includes(searchLower),
      )
    }

    const qualificationsWithQuestions = await Promise.all(
      qualifications.map(async (qualification) => {
        const questions = await ctx.db
          .query("questions")
          .withIndex("by_qualification", (q) =>
            q.eq("qualificationId", qualification._id),
          )
          .collect()

        const baseExams = await ctx.db
          .query("basePracticalExams")
          .withIndex("qualificationId", (q) =>
            q.eq("qualificationId", qualification._id),
          )
          .collect()

        return {
          qualification: qualification,
          questionsCount: questions.length,
          baseExams: baseExams,
        }
      }),
    )

    qualificationsWithQuestions.sort((a, b) =>
      a.qualification.name.localeCompare(b.qualification.name),
    )

    return {
      qualifications: qualificationsWithQuestions,
    }
  },
})

//fisher yates shuffle do tablicy
function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array]
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[shuffledArray[i]!, shuffledArray[j]!] = [
      shuffledArray[j]!,
      shuffledArray[i]!,
    ]
  }
  return shuffledArray
}

export const getTestQuestions = query({
  args: {
    qualificationName: v.string(),
    numberOfQuestions: v.optional(v.number()),
    _refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { qualificationName, numberOfQuestions } = args
    const questionsLimit = numberOfQuestions ?? 40

    const qualificationId = await getQualificationIdFromNameOrThrow(
      ctx,
      qualificationName,
    )

    const allQuestions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualificationId", qualificationId),
      )
      .collect()

    if (allQuestions.length === 0) {
      return { questions: [] }
    }

    const shuffledQuestions = shuffleArray(allQuestions)
    const selectedQuestions = shuffledQuestions.slice(0, questionsLimit)

    const questionsWithDetails = await Promise.all(
      selectedQuestions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()

        const sortedAnswers = answers.sort((a, b) =>
          a.label.localeCompare(b.label),
        )

        return {
          question: question,
          answers: sortedAnswers,
          correctAnswerIndex: sortedAnswers.findIndex(
            (answer) => answer.isCorrect,
          ),
        }
      }),
    )

    return {
      questions: questionsWithDetails,
    }
  },
})

export const getRandomQuestion = query({
  args: {
    qualificationName: v.string(),
    _refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { qualificationName } = args
    const qualificationId = await getQualificationIdFromNameOrThrow(
      ctx,
      qualificationName,
    )

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualificationId", qualificationId),
      )
      .collect()

    if (questions.length === 0) {
      return { randomQuestion: null, answers: [] }
    }

    const randomIndex = Math.floor(Math.random() * questions.length)
    const randomQuestion = questions[randomIndex]

    if (!randomQuestion) {
      return { randomQuestion: null, answers: [] }
    }

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", randomQuestion._id))
      .collect()

    const sortedAnswers = answers.sort((a, b) => a.label.localeCompare(b.label))

    return {
      randomQuestion: randomQuestion,
      answers: sortedAnswers,
    }
  },
})

export const getBrowseQuestions = query({
  args: {
    qualificationName: v.string(),
    search: v.optional(v.string()),
    year: v.optional(v.number()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    _refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { qualificationName, search, year, limit = 50, offset = 0 } = args

    const qualificationId = await getQualificationIdFromNameOrThrow(
      ctx,
      qualificationName,
    )

    let questionsQuery = ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualificationId", qualificationId),
      )

    let questions = await questionsQuery.collect()

    if (year) {
      questions = questions.filter((q) => q.year === year)
    }

    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase()
      questions = questions.filter((q) =>
        q.content.toLowerCase().includes(searchLower),
      )
    }

    questions.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))

    const totalFilteredQuestions = questions.length

    const paginatedQuestions = questions.slice(offset, offset + limit)

    const questionsWithDetails = await Promise.all(
      paginatedQuestions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect()

        const sortedAnswers = answers.sort((a, b) =>
          a.label.localeCompare(b.label),
        )

        return {
          question: question,
          answers: sortedAnswers,
          correctAnswerIndex: sortedAnswers.findIndex(
            (answer) => answer.isCorrect,
          ),
        }
      }),
    )

    return {
      questions: questionsWithDetails,
      total: totalFilteredQuestions,
    }
  },
})

export const getQuestionsStats = query({
  args: { qualificationName: v.string() },
  handler: async (ctx, { qualificationName }) => {
    const qualificationId = await getQualificationIdFromNameOrThrow(
      ctx,
      qualificationName,
    )

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualificationId", qualificationId),
      )
      .collect()

    const years = [...new Set(questions.map((q) => q.year))].sort(
      (a, b) => b - a,
    )

    return {
      total: questions.length,
      years,
    }
  },
})

export const getQualificationFromId = query({
  args: { qualificationId: v.id("qualifications") },
  handler: async (ctx, { qualificationId }) => {
    return await ctx.db.get(qualificationId)
  },
})
