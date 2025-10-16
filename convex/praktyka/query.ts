import { asyncMap } from "convex-helpers"
import { paginationOptsValidator } from "convex/server"
import { ConvexError, v, type Infer } from "convex/values"
import { query } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"
import { getExamDetailsFunc, getExamsForQualification } from "./helpers"

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

    const qualificationsWithExams = await getExamsForQualification(
      ctx,
      qualifications,
      sort,
    )

    return {
      ...qualificationsQuery,
      page: qualificationsWithExams,
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
    if (!baseExam) throw new ConvexError("Nie znaleziono egzaminu")

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

    if (!userExam) throw new ConvexError("Nie znaleziono egzaminu")
    if (userExam.userId !== userId)
      throw new ConvexError("Nie masz dostępu do tego egzaminu")

    const baseExam = await ctx.db.get(userExam.examId)
    if (!baseExam) throw new ConvexError("Nie znaleziono egzaminu")

    const qualification = await ctx.db.get(baseExam.qualificationId)
    if (!qualification) throw new ConvexError("Nie znaleziono kwalifikacji")

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
      if (!baseExam) throw new ConvexError("Nie znaleziono egzaminu")
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

export const listSavedQualificationsWithExams = query({
  handler: async (ctx) => {
    const user = await getUserProfileOrThrow(ctx)
    if (
      user.savedQualificationsIds?.length === 0 ||
      !user.savedQualificationsIds
    ) {
      return []
    }
    const qualifications = await asyncMap(
      user.savedQualificationsIds,
      async (id) => {
        const a = await ctx.db.get(id)
        if (!a) return null
        return a
      },
    )

    const filtered = qualifications.filter((item) => item !== null)

    const examsWithQualifications = await getExamsForQualification(
      ctx,
      filtered,
    )
    return examsWithQualifications
  },
})
