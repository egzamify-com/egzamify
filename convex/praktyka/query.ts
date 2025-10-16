import { asyncMap } from "convex-helpers"
import { paginationOptsValidator } from "convex/server"
import { v, type Infer } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow } from "../custom_helpers"
import { getExamDetailsFunc } from "./helpers"

export type ListPracticalExamsFilter = Infer<
  typeof ListPracicalExamsFilterValidator
>

const ListPracicalExamsFilterValidator = v.object({
  qualificationId: v.union(v.id("qualifications"), v.literal("wszystkie")),
  sort: v.union(v.literal("asc"), v.literal("desc")),
  search: v.string(),
})

export const listPracticalExams = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filters: ListPracicalExamsFilterValidator,
  },
  handler: async (
    ctx,
    { paginationOpts, filters: { qualificationId, sort, search } },
  ) => {
    await getUserIdOrThrow(ctx)

    const qualificationsQuery = search
      ? await ctx.db
          .query("qualifications")
          .withSearchIndex("combined_search", (q) =>
            q.search("nameLabelCombined", search),
          )
          .paginate(paginationOpts)
      : await ctx.db.query("qualifications").paginate(paginationOpts)

    const qualifications = qualificationsQuery.page.filter((qualification) => {
      console.log("in filtering checking - ", qualification._id)
      if (qualificationId === "wszystkie") {
        return true
      }
      if (qualification._id === qualificationId) {
        return true
      }
      return false
    })

    console.log({ qualifications })

    const examsWithQualifications = await asyncMap(
      qualifications,
      async (qualification) => {
        const baseExams = await ctx.db
          .query("basePracticalExams")
          .withIndex("qualificationId", (q) =>
            q.eq("qualificationId", qualification._id),
          )
          .collect()

        const sorted = baseExams.sort((a, b) => {
          function getYearAndMonth(code: string): {
            year: number
            month: number
          } {
            const year = parseInt(code.slice(8, 10), 10)
            const month = parseInt(code.slice(11, 13), 10)
            return { year, month }
          }

          const dateA = getYearAndMonth(a.code)
          const dateB = getYearAndMonth(b.code)

          if (dateA.year !== dateB.year) {
            return dateA.year - dateB.year
          }

          return dateA.month - dateB.month
        })

        return {
          baseExams: sorted,
          qualification,
        }
      },
    )
    // console.log({ examsWithQualifications })

    const finalList = examsWithQualifications
      .filter((qualification) => qualification.baseExams.length > 0)
      .sort((a, b) => {
        if (sort === "asc") {
          return a.qualification.name.localeCompare(
            b.qualification.name,
            "en",
            {
              sensitivity: "base",
            },
          )
        } else {
          return b.qualification.name.localeCompare(
            a.qualification.name,
            "en",
            {
              sensitivity: "base",
            },
          )
        }
      })
    return {
      ...qualificationsQuery,
      page: finalList,
    }
  },
})

export const getExamDetails = query({
  args: { examId: v.id("basePracticalExams") },
  handler: async (ctx, { examId }) => {
    await getUserIdOrThrow(ctx)

    return getExamDetailsFunc(examId, ctx)
  },
})

export const getUserExamFromExamCode = query({
  args: { examCode: v.string() },
  handler: async (ctx, { examCode }) => {
    const userId = await getUserIdOrThrow(ctx)

    const baseExam = await getExamDetailsFunc(examCode, ctx)
    if (!baseExam) throw new Error("Base exam not found")

    const userExam = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_userId_examId", (q) =>
        q.eq("userId", userId).eq("examId", baseExam._id),
      )
      .filter((q) => q.eq(q.field("status"), "user_pending"))
      .first()

    return {
      userExam,
      baseExam,
    }
  },
})

export const getUserExamDetails = query({
  args: { userExamId: v.id("usersPracticalExams") },
  handler: async (ctx, { userExamId }) => {
    const userId = await getUserIdOrThrow(ctx)

    const userExam = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_id", (q) => q.eq("_id", userExamId))
      .first()

    if (!userExam) throw new Error("User exam not found")
    if (userExam.userId !== userId) throw new Error("Unauthorized")

    const baseExam = await ctx.db.get(userExam.examId)
    if (!baseExam) throw new Error("Base exam not found")

    const qualification = await ctx.db.get(baseExam.qualificationId)
    if (!qualification) throw new Error("Qualification not found")

    return {
      ...userExam,
      baseExam: {
        ...baseExam,
        qualification,
      },
    }
  },
})
export const listUserExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getUserIdOrThrow(ctx)
    const userExams = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "done"))
      .order("desc")
      .paginate(paginationOpts)

    const withQ = await asyncMap(userExams.page, async (userExam) => {
      const baseExam = await ctx.db.get(userExam.examId)
      if (!baseExam) throw new Error("Exam not found")
      const qualification = await ctx.db.get(baseExam.qualificationId)

      return {
        ...userExam,
        baseExam: {
          ...baseExam,
          qualification,
        },
      }
    })
    return {
      ...userExams,
      page: withQ,
    }
  },
})
export const getLatestUserPendingExam = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx)

    const latestPendingUserExam = await ctx.db
      .query("usersPracticalExams")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "ai_pending"))
      .order("desc")
      .collect()

    const exams = await asyncMap(latestPendingUserExam, async (userExam) => {
      const baseExam = await getExamDetailsFunc(userExam.examId, ctx)

      return {
        ...userExam,
        baseExam,
      }
    })

    return exams
  },
})
