import { asyncMap } from "convex-helpers"
import type { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import type { QueryCtx } from "convex/_generated/server"
import type { FunctionReturnType } from "convex/server"
import { ConvexError, v } from "convex/values"

export type BaseExam = FunctionReturnType<
  typeof api.praktyka.query.getExamDetails
>
export type UserExam = Doc<"usersPracticalExams">

export const requirementsArray = v.array(
  v.object({
    symbol: v.string(),
    description: v.string(),
    answer: v.optional(
      v.object({
        isCorrect: v.boolean(),
        explanation: v.string(),
      }),
    ),
  }),
)

export const requirementsValidator = v.array(
  v.object({
    title: v.string(),
    note: v.optional(v.string()),
    symbol: v.string(),
    requirements: requirementsArray,
  }),
)

export const practicalExamAttachmentValidator = v.array(
  v.object({
    attachmentName: v.string(),
    attachmentId: v.id("_storage"),
  }),
)
export async function getExamDetailsFunc(examCode: string, ctx: QueryCtx) {
  console.log("finding exam with code - ", examCode)
  const exam = await ctx.db
    .query("basePracticalExams")
    .withIndex("examCode", (q) => q.eq("code", examCode))
    .first()

  console.log("exam ?", exam?._id)

  if (!exam) throw new ConvexError("Nie znaleziono egzaminu")

  const qualification = await ctx.db.get(exam.qualificationId)

  return {
    ...exam,
    qualification,
  }
}

export async function getExamsForQualification(
  ctx: QueryCtx,
  qualifications: Doc<"qualifications">[],
  sort: "asc" | "desc" = "asc",
) {
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
  const finalList = examsWithQualifications
    .filter((qualification) => qualification.baseExams.length > 0)
    .sort((a, b) => {
      if (sort === "asc") {
        return a.qualification.name.localeCompare(b.qualification.name, "en", {
          sensitivity: "base",
        })
      } else {
        return b.qualification.name.localeCompare(a.qualification.name, "en", {
          sensitivity: "base",
        })
      }
    })
  return finalList
}

export function isQualificationSaved(
  checkingQualificationId: Id<"qualifications">,
  user: Doc<"users">,
) {
  if (user.savedQualificationsIds?.includes(checkingQualificationId)) {
    return true
  } else {
    return false
  }
}
